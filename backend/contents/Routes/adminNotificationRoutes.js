const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const Ticket = require('../models/Ticket');
const Bill = require('../models/Bill');
const User = require('../models/User');

// Get admin notifications from various sources
router.get('/admin/notifications', async (req, res) => {
  try {
    const notifications = [];

    // Recent orders (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrders = await Order.find({ 
      date: { $gte: weekAgo },
      status: 'Pending'
    }).populate('orderedBy', 'name email').sort({ date: -1 }).limit(10);

    recentOrders.forEach(order => {
      notifications.push({
        id: `order_${order._id}`,
        type: 'Order',
        message: `New order from ${order.orderedBy?.name || 'Customer'} - ₹${order.price}`,
        timestamp: new Date(order.date).toISOString(),
        isRead: false
      });
    });

    // Recent feedback (last 7 days)
    const recentFeedback = await Feedback.find({ 
      createdAt: { $gte: weekAgo }
    }).populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

    recentFeedback.forEach(feedback => {
      notifications.push({
        id: `feedback_${feedback.feedbackId}`,
        type: 'Feedback',
        message: `New feedback from ${feedback.user?.name || 'User'} - ${feedback.tag}`,
        timestamp: new Date(feedback.createdAt).toISOString(),
        isRead: false
      });
    });

    // Open support tickets
    const openTickets = await Ticket.find({ 
      status: 'Open'
    }).populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

    openTickets.forEach(ticket => {
      notifications.push({
        id: `ticket_${ticket.ticketId}`,
        type: 'Support',
        message: `Support ticket: ${ticket.subject}`,
        timestamp: new Date(ticket.createdAt).toISOString(),
        isRead: false
      });
    });

    // Pending bills
    const pendingBills = await Bill.find({ 
      status: 'Pending'
    }).sort({ billDate: -1 }).limit(5);

    pendingBills.forEach(bill => {
      notifications.push({
        id: `bill_${bill.billId}`,
        type: 'Billing',
        message: `Pending bill for ${bill.customer} - ₹${bill.totalAmount}`,
        timestamp: new Date(bill.billDate).toISOString(),
        isRead: false
      });
    });

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read (dismiss individual notification)
router.post('/admin/notifications/dismiss', async (req, res) => {
  try {
    const { notificationId } = req.body;
    
    // For now, we'll just return success since notifications are generated dynamically
    // In a real app, you'd store dismissed notifications in a separate collection
    res.json({ message: 'Notification dismissed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear all notifications
router.post('/admin/notifications/clear', async (req, res) => {
  try {
    // For now, we'll just return success since notifications are generated dynamically
    // In a real app, you'd mark all notifications as read in a separate collection
    res.json({ message: 'All notifications cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
