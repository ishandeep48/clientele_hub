const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const hashPassword = require("../functions/hashing");

router.get("/admin/orders/all", async (req, res) => {
  try {
    const orders = await Order.find().populate("orderedBy", "uid");
    const users = await User.find();
    if (!orders || orders.length === 0) {
      return res.json({
        message: "No orders found",
        totalRevenue: 0,
        totalCustomers: 0,
        totalSales: 0,
        pendingOrders: 0,
        salesOverviewArray: [],
        orderOverview: [],
        paymentOverview: [] ,
        feedbackSentiment: [],
        leadVScustArray: [],
      });
    }
    //Top 4 cars
    const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
    const totalCustomers = users.length || 0; // testing purpose
    const totalSales = orders.length || 0; //testing purpose
    const pendingOrders =
      orders.filter((order) => order.status == "Pending").length || 0; //testing purpose
    //payment method chart
    const paymentOverview = orders.reduce((acc, order) => {
      acc[order.method] = (acc[order.method] || 0) + 1;
      return acc;
    }, {});
    const paymentOverviewArray = Object.entries(paymentOverview).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    //feedback sentiment chart - use actual customer feedback
    const feedbackData = await Feedback.find().populate("user", "name email");
    const feedbackSentiment = feedbackData.map((f) => ({
      message: f.message,
      rating: f.rating || 3,
      tag: f.tag || "Suggestion",
      customer: f.user?.name || f.user?.email || "Unknown",
      date: new Date(f.createdAt).toLocaleDateString(),
    }));
    //sales chart
    const salesOverview = orders.reduce((acc, order) => {
      const date = new Date(order.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.price;
      return acc;
    }, {});
    //real sales chart data to be sent
    const salesOverviewArray = Object.entries(salesOverview).map(
      ([date, amount]) => ({
        date,
        amount,
      })
    );
    //order overview chart
    const orderOverview = orders.map((order) => ({
      date: new Date(order.date).toLocaleDateString(),
    }));
    console.log(Array.isArray(salesOverviewArray)); // true if it's an array

    const leadVScust = users.reduce((acc, user) => {
      acc[user.userType] = (acc[user.userType] || 0) + 1;
      return acc;
    }, {});

    const leadVScustArray = [
      { name: "Lead", value: leadVScust.lead || 0 },
      { name: "Customer", value: leadVScust.customer },
    ];
    console.log(Array.isArray(leadVScustArray));
    // console.log(leadVScust,leadVScustArray);
    // console.log(salesOverviewArray);
    res.json({
      totalRevenue,
      totalCustomers,
      totalSales,
      pendingOrders,
      salesOverviewArray,
      orderOverview,
      paymentOverview: paymentOverviewArray,
      feedbackSentiment,
      leadVScustArray,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/leads/all", async (req, res) => {
  try {
    const leads = await User.find({ userType: "lead" }).select(
      "name email company source joinedAt uid phone -_id"
    );
    res.json(leads);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/admin/leads/new", async (req, res) => {
  try {
    const { newLead } = req.body;
    console.log(newLead);
    if (newLead.uid) {
      const user = await User.findOne({ uid: newLead.uid });

      if (user) {
        user.name = newLead.name;
        user.email = newLead.email;
        user.company = newLead.company;
        user.source = newLead.source;
        await user.save();
        console.log(user);
        return res.status(201).json({ message: "ok" });
      }
    } else {
      const passs = await hashPassword("password");
      const id = await nanoid();
      console.log(passs, id);
      const role = "user";
      const userType = "lead";
      const newUser = new User({
        uid: id,
        name: newLead.name,
        email: newLead.email,
        password: passs,
        userType,
        role,
        company: newLead.company,
        source: newLead.source,
        phone: newLead.phone,
        joinedAt: Date.now(),
      });
      console.log(newUser);
      await newUser.save();
      return res.status(201).json({ message: "ok" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Some error occured" });
  }
});

router.post("/admin/leads/delete", async (req, res) => {
  const del_uid = req.body.uid;
  if (!del_uid) {
    return res.status(404).json({ message: "Invalid body" });
  }
  try {
    await User.deleteOne({ uid: del_uid });
    console.log("deleted a user");
    return res.status(201).json({ message: "done" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Some error on our side" });
  }
});

router.post("/admin/leads/bulk-convert", async (req, res) => {
  const { uids } = req.body;
  console.log(uids);

  try {
    const result = await User.updateMany(
      { uid: { $in: uids } },
      { $set: { userType: "customer" } }
    );
    return res.status(201).json({ message: "converted", success: true });
  } catch (err) {
    return res.status(500).json({ message: "error", success: false });
  }
});

module.exports = router;
