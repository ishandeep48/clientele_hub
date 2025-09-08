const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const User = require("../models/User");
const hashPassword = require("../functions/hashing");
const { SECRET_KEY, verifyToken } = require("../functions/verifyToken");

// User signup
router.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password, phone, company, userType } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "email already in use" });

    const uid = nanoid();
    const hashed = await hashPassword(password);

    const user = new User({
      uid,
      name,
      email,
      password: hashed,
      role: "user",
      userType: userType === "lead" ? "lead" : "customer",
      company: company || "",
      phone: phone || "",
      joinedAt: Date.now(),
    });
    await user.save();

    const token = jwt.sign(
      { userID: user._id, uid: user.uid, mail: user.email, role: user.role, name: user.name },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      message: "signup successful",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

// User login
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign(
      { userID: user._id, uid: user.uid, mail: user.email, role: user.role, name: user.name },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

// Get current user profile
router.get("/user/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userID).select("uid name email role userType company phone joinedAt");
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;


