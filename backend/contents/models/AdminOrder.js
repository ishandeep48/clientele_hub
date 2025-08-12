const mongoose = require("mongoose");

const adminOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  itemCount: {
    type: Number,
    required: true,
    min: 1,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Acknowledged', 'Cancelled'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  adminResponse: {
    type: String,
    default: '',
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  productDetails: {
    type: String,
    default: '',
  },
  shippingAddress: {
    type: String,
    default: '',
  },
  paymentMethod: {
    type: String,
    enum: ['Net Banking', 'Card', 'UPI', 'Cash on Delivery'],
    default: 'UPI',
  },
});

module.exports = mongoose.model("AdminOrder", adminOrderSchema);
