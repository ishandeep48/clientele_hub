const express = require('express');
const router = express.Router();
const { verifyToken } = require('../functions/verifyToken');
const Order = require('../models/Order');
const Bill = require('../models/Bill');
const User = require('../models/User');
const { nanoid } = require('nanoid');

function mapStatus(status) {
  if (status === 'Completed') return 'Delivered';
  if (status === 'Cancelled') return 'Cancelled';
  if (status === 'Shipped') return 'Shipped';
  return 'Processing';
}

// List current user's orders
router.get('/user/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userID;
    const orders = await Order.find({ orderedBy: userId }).sort({ date: -1 });
    const result = orders.map(o => ({
      id: o._id.toString(),
      name: 'Product',
      date: new Date(o.date).toISOString().slice(0, 10),
      total: Math.round((o.price || 0)),
      status: mapStatus(o.status),
      items: [],
      shippingAddress: '',
      tracking: ''
    }));
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order details
router.get('/user/orders/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userID;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, orderedBy: userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json({
      id: order._id.toString(),
      name: 'Product',
      date: new Date(order.date).toISOString().slice(0, 10),
      total: Math.round((order.price || 0)),
      status: mapStatus(order.status),
      items: [],
      shippingAddress: '',
      tracking: ''
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
 
// Create a new order for current user
router.post('/user/orders/new', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userID;
    const { total, paymentMode } = req.body || {};
    if (typeof total !== 'number') {
      return res.status(400).json({ error: 'total (number) required' });
    }
    let method = 'Net';
    if (paymentMode === 'UPI') method = 'UPI';
    else if (paymentMode === 'Card') method = 'Card';
    // 'Cash' not supported in schema; default to 'Net'

    const order = new Order({
      orderedBy: userId,
      method,
      price: total,
      status: 'Pending',
      date: Date.now(),
    });
    await order.save();

    // Create corresponding Bill so it shows up in billing
    try {
      const user = await User.findById(userId).select('name email');
      const bill = new Bill({
        billId: nanoid(10),
        order: order._id,
        customer: user?.name || user?.email || 'Customer',
        orderIdText: order._id.toString(),
        billDate: Date.now(),
        status: 'Pending',
        totalAmount: total,
        gst: 0,
      });
      await bill.save();
    } catch (e) {
      console.error('Bill create failed:', e);
    }

    return res.status(201).json({
      id: order._id.toString(),
      name: 'Product',
      date: new Date(order.date).toISOString().slice(0, 10),
      total: Math.round(order.price || 0),
      status: mapStatus(order.status),
      items: [],
      shippingAddress: '',
      tracking: ''
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


