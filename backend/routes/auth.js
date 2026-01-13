import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup fields:", req.body);  // DEBUG: See ALL fields

    const { email, password, name, dob, travelPreferences, travelFrequency, ecoLevel, mobilityPreferences, accommodationPreferences, diet, allergies } = req.body;

    // Validate required
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Name, email, password required!" });
    }

    // Email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user with ALL fields (your model supports them perfectly)
    const newUser = new User({
      name,
      email,
      password: hashed,
      dob,
      travelPreferences: travelPreferences || [],
      travelFrequency,
      ecoLevel,
      mobilityPreferences: mobilityPreferences || [],
      accommodationPreferences: accommodationPreferences || [],
      diet,
      allergies
    });

    await newUser.save();
    console.log("✅ User created:", newUser.email);

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("❌ Signup ERROR:", err.message);  // Detailed error to Render logs
    res.status(500).json({ message: `Signup error: ${err.message}` });
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
