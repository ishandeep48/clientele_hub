const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user"],
    default: "user",
  },
  userType: {
    type: String,
    required: false,
    enum: ["customer", "lead"],
  },
  company: {
    type: String,
  },
  source: {
    type: String,
    validate: {
      validator: function (value) {
        // If userType is 'lead', source must be provided
        return this.userType !== "lead" || (value && value.trim().length > 0);
      },
      message: "Source is required when userType is lead.",
    },
  },
  phone:{
    type: String,
    required: true,
  },
  joinedAt:{
    type:Date,
    required: true,
    default:Date.now(),
  }

});

module.exports = mongoose.model("User", userSchema);
