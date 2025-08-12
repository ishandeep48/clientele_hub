const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  gst: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  image: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
