const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middlerware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudConfig');
const upload = multer({ storage });

// Create Order
router.post('/',  protect, orderController.createOrder);

// Get All Orders (Admin)
router.get('/all',  protect, authorizeRoles('admin'), orderController.getOrders);

// Get Orders by UserId
router.get('/user/:userId',  protect, orderController.getOrdersByUserId);

// Get Order Summary & Stats
router.get('/summary',  protect, authorizeRoles('admin'), orderController.getOrderSummary);
router.get('/stats',  protect, authorizeRoles('admin'), orderController.getOrderStats);

// My Order History
router.get('/my-orders', protect, orderController.getMyOrderHistory);

// Get Invoice PDF
router.get('/:id/invoice',  protect, orderController.getOrderInvoice);

// Get Order by ID
router.get('/:id',  protect, orderController.getOrderById);

// Update Order Status
router.patch('/:id/status',  protect, authorizeRoles('admin'), orderController.updateOrderStatus);

// Cancel Order
router.post('/:id/cancel',  protect, orderController.cancelOrder);

// Delete Order
router.delete('/:id', protect, authorizeRoles('admin'), orderController.deleteOrder);

// Admin - User Order History
router.get('/admin/user/:userId/history',  protect, authorizeRoles('admin'), orderController.getUserOrderHistoryByAdmin);

// Tracking
router.get('/:id/tracking',  protect, orderController.getOrderTrackingDetails);
router.post('/:id/tracking',  protect, authorizeRoles('admin'), orderController.addTrackingUpdate);

// Order Detail Endpoints
router.get('/:id/payment',  protect, orderController.getOrderPaymentDetails);
router.get('/:id/shipping', protect, orderController.getOrderShippingDetails);
router.get('/:id/items', protect, orderController.getOrderItems);
router.get('/:id/total', protect, orderController.getOrderTotalPrice);
router.get('/:id/cancellation', protect, orderController.getOrderCancellationDetails);
router.get('/:id/refund', protect, orderController.getOrderRefundDetails);
router.get('/:id/return', protect, orderController.getOrderReturnDetails);
router.get('/:id/exchange', protect, orderController.getOrderExchangeDetails);
router.get('/:id/gift', protect, orderController.getOrderGiftDetails);
router.get('/:id/discount', protect, orderController.getOrderDiscountDetails);
router.get('/:id/promotion', protect, orderController.getOrderPromotionDetails);
router.get('/:id/coupon', protect, orderController.getOrderCouponDetails);
router.get('/:id/tax', protect, orderController.getOrderTaxDetails);

// Return Image Upload
router.post(
  '/:id/return/image',
  protect,
  upload.single('returnImage'),
  orderController.uploadReturnImage
);

module.exports = router;
