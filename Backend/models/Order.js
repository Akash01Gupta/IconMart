const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
});

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: Number,
  price: Number, // optional if pulling from product
});

const timelineEntrySchema = new mongoose.Schema({
  status: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const returnDetailsSchema = new mongoose.Schema({
  reason: String,
  requestedAt: { type: Date, default: Date.now },
  approved: Boolean,
  imageUrl: String,
});

const cancellationDetailsSchema = new mongoose.Schema({
  reason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cancelledAt: Date,
});

const refundDetailsSchema = new mongoose.Schema({
  reason: String,
  refunded: Boolean,
  refundedAt: Date,
  amount: Number,
});

const exchangeDetailsSchema = new mongoose.Schema({
  reason: String,
  approved: Boolean,
  exchangedAt: Date,
});

const giftDetailsSchema = new mongoose.Schema({
  isGift: Boolean,
  message: String,
  sender: String,
});

const discountDetailsSchema = new mongoose.Schema({
  code: String,
  discountAmount: Number,
});

const promotionDetailsSchema = new mongoose.Schema({
  campaign: String,
  promoAmount: Number,
});

const couponDetailsSchema = new mongoose.Schema({
  code: String,
  applied: Boolean,
  amount: Number,
});

const taxDetailsSchema = new mongoose.Schema({
  gst: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],

    shippingAddress: shippingAddressSchema,
    paymentMethod: String,
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,

    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,

    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    trackingTimeline: [timelineEntrySchema],

    cancellationDetails: cancellationDetailsSchema,
    refundDetails: refundDetailsSchema,
    returnDetails: returnDetailsSchema,
    exchangeDetails: exchangeDetailsSchema,
    giftDetails: giftDetailsSchema,

    discountDetails: discountDetailsSchema,
    promotionDetails: promotionDetailsSchema,
    couponDetails: couponDetailsSchema,
    taxDetails: taxDetailsSchema,
  },
  { timestamps: true }
);
module.exports = mongoose.model('Order', orderSchema);