const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order'); 
const PDFDocument = require('pdfkit');

const ALLOWED_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

async function findOrderOrFail(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid order ID' });
    return null;
  }

  const order = await Order.findById(id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return null;
  }

  return order;
}


module.exports.createOrder = async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // ✅ Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  const priceFields = { itemsPrice, taxPrice, shippingPrice, totalPrice };
  for (const [key, value] of Object.entries(priceFields)) {
    if (value == null || typeof value !== 'number' || value < 0) {
      return res.status(400).json({ message: `Invalid or missing price detail: ${key}` });
    }
  }

  try {
    // ✅ Ensure authenticated user
    if (!req.user || !req.user._id) {
      // console.error(' Missing req.user or req.user._id');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // ✅ Stock check and reduce quantity
    for (const item of items) {
      if (!item.product || typeof item.quantity !== 'number') {
        return res.status(400).json({ message: 'Invalid item format' });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }

      product.quantity -= item.quantity;
      await product.save();
    }

    // ✅ Create Order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // 🐞 Debug log before save
    // console.log('📦 Final Order to Save:', order);

    const createdOrder = await order.save();

    // ✅ Response
    res.status(201).json(createdOrder);

  } catch (error) {
    // console.error(' createOrder caught error:', error.message);
    // console.error(error.stack);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};


module.exports.getOrders = async (req, res) => {
  try {

    const { status, userId, fromDate, toDate, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.user = userId;
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;

    const [orders, count] = await Promise.all([
      Order.find(filter).populate('user', 'name email').populate('items.product', 'name').skip(skip).limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      total: count,
      page: Number(page),
      pageSize: orders.length,
      orders, // ✅ actual array of orders
    });
  } catch (err) {
    console.error('🔥 getOrders error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  console.log('Requested order ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID format' });
  }

  try {
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: error.message });
  }
};


// PATCH /api/orders/:id/status
module.exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const order = await findOrderOrFail(req.params.id, res);
  if (!order) return;

  try {
    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.remove();
    res.status(200).json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const skip = (page - 1) * limit;
    const [orders, count] = await Promise.all([
      Order.find({ user: userId }).populate('user', 'name email').skip(skip).limit(parseInt(limit)),
      Order.countDocuments({ user: userId }),
    ]);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json({
      total: count,
      page: Number(page),
      pageSize: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.getOrderSummary = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.status(200).json({ totalOrders, totalSales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getOrderStats = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getMyOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No order history found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserOrderHistoryByAdmin = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No order history found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getOrderPaymentDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'paymentMethod paymentResult');
    res.status(200).json(order.paymentMethod);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderShippingDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'shippingAddress shippingPrice');
    res.status(200).json({ shippingAddress: order.shippingAddress, shippingPrice: order.shippingPrice });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderItems = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'items');
    res.status(200).json(order.items);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderTotalPrice = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'totalPrice');
    res.status(200).json(order.totalPrice);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.addTrackingUpdate = async (req, res) => {
  const { id } = req.params;
  const { status, message } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.trackingTimeline.push({ status, message });
    await order.save();

    res.status(200).json(order.trackingTimeline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get order tracking details
module.exports.getOrderTrackingDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({
      status: order.status,
      carrier: order.carrier || 'Not Assigned',
      trackingNumber: order.trackingNumber || 'N/A',
      estimatedDelivery: order.estimatedDelivery || null,
      trackingTimeline: order.trackingTimeline || [],
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports.getOrderCancellationDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'cancellationDetails');
    res.status(200).json(order.cancellationDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderRefundDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'refundDetails');
    res.status(200).json(order.refundDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderReturnDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'returnDetails');
    res.status(200).json(order.returnDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderExchangeDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'exchangeDetails');
    res.status(200).json(order.exchangeDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderGiftDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'giftDetails');
    res.status(200).json(order.giftDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${order._id}.pdf`);

    doc.pipe(res);

    // 🧾 Invoice Header
    doc.fontSize(24).text('🧾 Invoice', { align: 'center' });
    doc.moveDown();

    // 📦 Order Info
    doc.fontSize(12)
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .text(`Status: ${order.status}`)
      .text(`Payment Method: ${order.paymentMethod}`)
      .moveDown();

    // 👤 Customer Info
    doc.fontSize(14).text('Customer Details', { underline: true });
    doc.fontSize(12)
      .text(`Name: ${order.user.name}`)
      .text(`Email: ${order.user.email}`)
      .text(`Phone: ${order.shippingAddress?.phone || 'N/A'}`)
      .text(`Address: ${order.shippingAddress?.address || 'N/A'}`)
      .moveDown();

    // 🛒 Items Table Header
    doc.fontSize(14).text('Items', { underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(12);

    const tableTop = doc.y;
    const col = {
      no: 50,
      name: 90,
      qty: 320,
      price: 370,
      total: 450,
    };

    doc.text('No.', col.no, tableTop);
    doc.text('Product', col.name, tableTop);
    doc.text('Qty', col.qty, tableTop);
    doc.text('Price', col.price, tableTop);
    doc.text('Total', col.total, tableTop);
    doc.moveTo(col.no, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown(1);
    doc.font('Helvetica');

    // 🧾 Items List
    let i = 1;
    order.items.forEach(item => {
      const product = item.product || {};
      const name = product.name || 'Unnamed Product';
      const quantity = item.quantity || 1;
      const price = item.price || product.price || 0;
      const total = quantity * price;

      const y = doc.y;

      doc.fontSize(11);
      doc.text(i, col.no, y);
      doc.text(name, col.name, y, { width: 210 });
      doc.text(quantity.toString(), col.qty, y);
      doc.text(`₹${price}`, col.price, y);
      doc.text(`₹${total}`, col.total, y);

      doc.moveDown(0.5);
      i++;
    });

    // 💰 Grand Total
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(12)
      .text(`Grand Total: ₹${order.totalPrice}`, { align: 'right' });

    // 👋 Footer
    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Oblique')
      .text('Thank you for shopping with us!', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
};


module.exports.getOrderDiscountDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'discountDetails');
    res.status(200).json(order.discountDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderPromotionDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'promotionDetails');
    res.status(200).json(order.promotionDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderCouponDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'couponDetails');
    res.status(200).json(order.couponDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.getOrderTaxDetails = async (req, res) => {
  try {
    const order = await getOrderFieldById(req.params.id, 'taxDetails');
    res.status(200).json(order.taxDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.uploadReturnImage = async (req, res) => {
  const order = await findOrderOrFail(req.params.id, res);
  if (!order) return;

  try {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/returns/${req.file.filename}`;

    order.returnDetails = {
      ...(order.returnDetails || {}),
      imageUrl,
    };

    await order.save();
    res.status(200).json({ message: 'Return image uploaded', imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports.cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      // console.log(`[cancelOrder] Order not found: ${id}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!req.user || !req.user._id || !req.user.role) {
      // console.log(`[cancelOrder] Invalid or missing user in request`);
      return res.status(401).json({ message: 'User authentication required' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user?.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      // console.log(`[cancelOrder] Unauthorized user: ${req.user._id}`);
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status === 'Cancelled') {
      // console.log(`[cancelOrder] Order already cancelled: ${id}`);
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (order.status !== 'Pending') {
      // console.log(`[cancelOrder] Cannot cancel non-pending order: Status is ${order.status}`);
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    // Update status and cancellation details
    order.status = 'Cancelled';
    order.cancellationDetails = {
      cancelledBy: req.user._id,
      cancelledAt: new Date(),
      reason: req.body?.reason || 'Cancelled by user',
    };

    await order.save({ validateBeforeSave: false });

    // console.log(`[cancelOrder] Order cancelled successfully: ${order._id}`);
    return res.status(200).json({ message: 'Order cancelled successfully', order });

  } catch (error) {
    // console.error('[cancelOrder] Internal error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};



