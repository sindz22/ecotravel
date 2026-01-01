import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";


// ✅ 1. Imports (Routes)
import authRouter from "./routes/auth.js";      // Login & Signup
import overpassRouter from "./routes/overpass.js"; // Tourist places
import airportsRouter from "./routes/airports.js"; // Airports
import itinerariesRouter from './routes/itineraries.js';

// ✅ 2. Configure environment variables
dotenv.config();

// ✅ 3. Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 4. Middleware
app.use(cors());
app.use(express.json());


// ✅ 5. Mount Routes
// Auth Routes (Login/Signup)
app.use("/api/auth", authRouter);

// Itinerary Routes (Tourist Places & Airports)
app.use("/api", overpassRouter);
app.use("/api", airportsRouter);
app.use('/api/itineraries', itinerariesRouter);  // ✅ ADD THIS LINE


// ✅ 6. Connect to MongoDB
// Tries to connect to Atlas (if in .env) OR Localhost
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecotravel")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log("⚠️ If using local MongoDB, make sure it is running.");
    console.log("⚠️ If using Atlas, check your IP whitelist.");
  });

// --- Optional: Fallback/Test Routes (Preserved from your code) ---

// Mock route endpoint (keep this if your frontend calls it directly)
app.post("/route", (req, res) => {
  console.log("Route endpoint hit:", req.body);
  res.json({
    features: [{
      properties: {
        summary: { distance: 173000, duration: 10200 }
      }
    }]
  });
});

// Manual Overpass fallback (safety net if route file fails)
app.post("/overpass", async (req, res) => {
  try {
    const { query } = req.body;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 7. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
