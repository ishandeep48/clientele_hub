const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
// const AdminOrder = require("../models/AdminOrder");
const { nanoid } = require("nanoid");

// Get all admin orders
router.get("/admin/orders/getall", async (req, res) => {
  try {
    const orders = await Order.find().populate('orderedBy', 'uid');
    
    // Transform the data to match the requested format
    const transformedOrders = orders.map(order => ({
      orderId: order._id.toString(),
      customer: {
        name: order.orderedBy ? order.orderedBy.name : 'Unknown Customer',
        email: order.orderedBy ? order.orderedBy.email : '',
        phone: order.orderedBy ? order.orderedBy.phone : ''
      },
      product: 'Product', // Placeholder since your Order model doesn't have product info
      status: order.status,
      total: order.price,
      items: 1, // Default to 1 since your model doesn't have itemCount
      date: new Date(order.date).toISOString()
    }));
    
    res.json(transformedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get order details by ID
router.get("/admin/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const order = await Order.findById(id).populate('orderedBy', 'name email phone company');
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const transformedOrder = {
      orderId: order._id.toString(),
      customer: {
        name: order.orderedBy ? order.orderedBy.name : 'Unknown Customer',
        email: order.orderedBy ? order.orderedBy.email : '',
        phone: order.orderedBy ? order.orderedBy.phone : ''
      },
      product: 'Product', // Placeholder since your model doesn't have product info
      status: order.status,
      total: order.price,
      items: 1, // Default to 1
      date: new Date(order.date).toISOString(),
      adminResponse: '', // Your model doesn't have this field
      productDetails: 'Product details not available', // Placeholder
      shippingAddress: 'Address not available', // Placeholder
      paymentMethod: order.method,
    };
    
    res.json(transformedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Acknowledge order
router.put("/admin/orders/:id/acknowledge", async (req, res) => {
  try {
    const { id } = req.params;
    const { adminResponse } = req.body;
    console.log(id)
    const order = await Order.findById(id);
    console.log(order)
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    order.status = "Completed"; // Your model uses "Completed" instead of "Acknowledged"
    await order.save();
    
    res.json({ message: "Order acknowledged successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel order
router.put("/admin/orders/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const { adminResponse } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    order.status = "Cancelled";
    await order.save();
    
    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new order (for testing)
router.post("/admin/orders/new", async (req, res) => {
  try {
    const { order } = req.body;
    
    const orderId = await nanoid(10);
    const newOrder = new Order({
      orderId: orderId,
      customerName: order.customerName,
      productName: order.productName,
      itemCount: order.itemCount,
      total: order.total,
      status: order.status || 'Pending',
      orderDate: new Date(order.orderDate || Date.now()),
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      productDetails: order.productDetails || '',
      shippingAddress: order.shippingAddress || '',
      paymentMethod: order.paymentMethod || 'UPI',
    });
    
    await newOrder.save();
    return res.status(201).json({ message: "Order created successfully", orderId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Seed sample admin orders
router.post("/admin/orders/seed", async (req, res) => {
  try {
    // Check if orders already exist
    const existingOrders = await Order.find().populate('orderedBy', 'uid');
    // if (existingOrders.length > 0) {
    //   return res.status(400).json({ message: "Orders already seeded" });
    // }

    const sampleOrders = [
      {
        orderId: await nanoid(10),
        customerName: "John Doe",
        productName: "Laptop Pro X1",
        itemCount: 1,
        total: 89999,
        status: "Pending",
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        customerEmail: "john.doe@example.com",
        customerPhone: "+91-9876543210",
        productDetails: "High-performance laptop with latest specifications",
        shippingAddress: "123 Main St, Bangalore, Karnataka 560001",
        paymentMethod: "UPI",
        price: 89999,
        method: "UPI",
      },
      {
        orderId: await nanoid(10),
        customerName: "Jane Smith",
        productName: "Wireless Mouse",
        itemCount: 2,
        total: 2598,
        status: "Completed",
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        customerEmail: "jane.smith@example.com",
        customerPhone: "+91-8765432109",
        productDetails: "Ergonomic wireless mouse with precision tracking",
        shippingAddress: "456 Park Ave, Mumbai, Maharashtra 400001",
        paymentMethod: "Card",
        adminResponse: "Order confirmed and will be shipped within 24 hours",
        price: 89999,
        method: "Card",
      },
      {
        orderId: await nanoid(10),
        customerName: "Mike Johnson",
        productName: "Office Chair",
        itemCount: 1,
        total: 4500,
        status: "Pending",
        orderDate: new Date(),
        customerEmail: "mike.johnson@example.com",
        customerPhone: "+91-7654321098",
        productDetails: "Comfortable office chair with adjustable height",
        shippingAddress: "789 Oak Rd, Delhi, Delhi 110001",
        paymentMethod: "Net Banking",
        price: 89999,
        method: "Net",
      },
      {
        orderId: await nanoid(10),
        customerName: "Sarah Wilson",
        productName: "Bluetooth Headphones",
        itemCount: 1,
        total: 2500,
        status: "Cancelled",
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        customerEmail: "sarah.wilson@example.com",
        customerPhone: "+91-6543210987",
        productDetails: "Noise-cancelling bluetooth headphones",
        shippingAddress: "321 Pine St, Chennai, Tamil Nadu 600001",
        paymentMethod: "UPI",
        adminResponse: "Order cancelled due to out of stock",
        price: 89999,
        method: "UPI",
      },
      {
        orderId: await nanoid(10),
        customerName: "David Brown",
        productName: "Smartphone Galaxy S23",
        itemCount: 1,
        total: 75000,
        status: "Completed",
        orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        customerEmail: "david.brown@example.com",
        customerPhone: "+91-5432109876",
        productDetails: "Latest smartphone with advanced camera features",
        shippingAddress: "654 Elm St, Hyderabad, Telangana 500001",
        paymentMethod: "Card",
        adminResponse: "Order processed and shipped successfully",
        price: 89999,
        method: "Card",
      }
    ];

    await Order.insertMany(sampleOrders);
    return res.status(201).json({ message: "Sample orders seeded successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
