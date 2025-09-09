const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { nanoid } = require("nanoid");
const hashPassword = require("../functions/hashing");

// Get all customers
router.get("/admin/customers/all", async (req, res) => {
  try {
    const customers = await User.find({ userType: "customer" }).select(
      "uid name email company phone joinedAt -_id"
    );
    
    // Transform the data to match the frontend interface
    const transformedCustomers = customers.map(customer => ({
      id: customer.uid,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company || "",
      joinedAt: new Date(customer.joinedAt).toLocaleDateString()
    }));
    
    res.json(transformedCustomers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new customer
router.post("/admin/customers/new", async (req, res) => {
  try {
    const { customer } = req.body;
    
    if (customer.id) {
      // Update existing customer
      const user = await User.findOne({ uid: customer.id });
      if (user) {
        user.name = customer.name;
        user.email = customer.email;
        user.company = customer.company;
        user.phone = customer.phone;
        await user.save();
        return res.status(200).json({ message: "Customer updated successfully" });
      }
    } else {
      // Create new customer
      const id = await nanoid();
      const password = await hashPassword("password");
      const newUser = new User({
        uid: id,
        name: customer.name,
        email: customer.email,
        password: password, // You might want to generate a random password
        userType: "customer",
        role: "user",
        company: customer.company,
        phone: customer.phone,
        joinedAt: new Date(),
      });
      
      await newUser.save();
      return res.status(201).json({ message: "Customer created successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete customer
router.delete("/admin/customers/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.deleteOne({ uid: id });
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
