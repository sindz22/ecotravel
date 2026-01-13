import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ ...req.body, password: hashed });
    await newUser.save();

    return res.status(201).json({ message: "Account created successfully!" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Signup error!" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials!" });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials!" });

    // Create Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "SECRET123",
      { expiresIn: "5h" }
    );

    return res.status(200).json({
      message: "Login successful!",
      token
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Login error!" });
  }
});

export default router;
