const express = require('express');
const router = express.Router();
const { verifyToken } = require('../functions/verifyToken');
const Order = require('../models/Order');

// GET /user/dashboard - returns dashboard data for logged-in user
router.get('/user/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userID;

    const orders = await Order.find({ orderedBy: userId }).sort({ date: -1 });

    const totalOrders = orders.length;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const ordersLastMonth = orders.filter(o => new Date(o.date) > oneMonthAgo).length;

    const pendingAmount = orders
      .filter(o => o.status === 'Pending')
      .reduce((acc, o) => acc + (o.price || 0), 0);

    // Format INR simple string (client earlier used a string value)
    const pendingPayments = `₹${pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // No tickets model; approximate as count of pending orders to avoid new collections
    const activeTickets = orders.filter(o => o.status === 'Pending').length;

    const recentOrders = orders.slice(0, 3).map(o => ({
      id: o._id.toString(),
      orderId: o._id.toString(),
      product: 'Product',
      status: o.status === 'Completed' ? 'Completed' : (o.status === 'Pending' ? 'Pending' : 'In Progress'),
      createdAt: new Date(o.date).toISOString(),
    }));

    return res.json({ totalOrders, ordersLastMonth, pendingPayments, activeTickets, recentOrders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


