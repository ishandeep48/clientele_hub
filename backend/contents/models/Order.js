const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const User = require("./User");

const id = nanoid(10);
const orderSchema = new mongoose.Schema({
  date: {
    required: true,
    type: Date,
    default: Date.now(),
  },
  id: {
    required: true,
    type: String,
    default: id,
  },
  orderedBy: {
    required: true,
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
    required: true,
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
