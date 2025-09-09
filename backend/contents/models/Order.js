const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const User = require("./User");

// const id = nanoid(10);
const orderSchema = new mongoose.Schema({
  date: {
    required: true,
    type: Date,
    default: Date.now(),
  },
  Paymentid: {
    required: true,
    type: String,
    default: ()=>nanoid(10),
  },
  orderedBy: {
    // required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  method: {
    type: String,
    enum: ["Net", "Card", "UPI"], // example
    required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  // Array of ordered items added to support client display
  items: {
    type: [
      new mongoose.Schema({
        product: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        price: { type: Number, required: true, min: 0, default: 0 },
      }, { _id: false })
    ],
    default: []
  },
  // Flattened shipping address string for quick rendering on client
  shippingAddress: {
    type: String,
    default: ''
  },
  // Optional free-text notes from customer
  notes: {
    type: String,
    default: ''
  },
  // Optional tracking string
  tracking: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled", "Shipped"], 
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
