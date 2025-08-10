const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

router.get("/admin/orders/all", async (req, res) => {
  try {
    const orders = await Order.find().populate("orderedBy", "uid");
    const users = await User.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    //Top 4 cars
    const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
    const totalCustomers = users.length || 69; // testing purpose
    const totalSales = orders.length || 8008; //testing purpose
    const pendingOrders =
      orders.filter((order) => order.status == "Pending").length || 65; //testing purpose
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

    //feedback sentiment chart
    const feedbackSentiment = orders.reduce((acc, order) => {
      if (order.rating) {
        acc.push(order.rating);
      }
      return acc;
    }, []);
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

    const leadVScust=users.reduce((acc,user)=>{
        acc[user.userType]=(acc[user.userType]||0)+1;
        return acc;
    },{});
    
    const leadVScustArray =[
        {name:"Lead", value:leadVScust.lead||0},
        {name:"Customer", value:leadVScust.customer}
    ];
    console.log(Array.isArray(leadVScustArray))
    // console.log(leadVScust,leadVScustArray);
    // console.log(salesOverviewArray);
    res.json({
      totalRevenue,
      totalCustomers,
      totalSales,
      pendingOrders,
      salesOverviewArray,
      orderOverview,
      paymentOverview:paymentOverviewArray,
      feedbackSentiment,
      leadVScustArray
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
