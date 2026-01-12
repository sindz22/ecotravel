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
import userRoutes from './routes/user.js'; 

// ✅ 2. Configure environment variables
dotenv.config();

// ✅ 3. Initialize App
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

// ✅ 4. Middleware
app.use(cors());
app.use(express.json());

app.use(cors({ origin: "*", credentials: true }));
app.options('*', cors());

app.use('/api/user', userRoutes);  


// ✅ 5. Mount Routes
// Auth Routes (Login/Signup)
app.use("/api/auth", authRouter);

// Itinerary Routes (Tourist Places & Airports)
app.use("/api", overpassRouter);
app.use("/api", airportsRouter);
app.use('/api/itineraries', itinerariesRouter);  // ✅ ADD THIS LINE

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/ecotravel"; // local fallback

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log("⚠️ If using local MongoDB, make sure it is running.");
    console.log("⚠️ If using Atlas, check your IP whitelist.");
  });

  
// Test / health route
app.get("/", (req, res) => {
  res.send("EcoTravel backend is running");
});

// Mock route endpoint (optional)
app.post("/route", (req, res) => {
  console.log("Route endpoint hit:", req.body);
  res.json({
    features: [
      {
        properties: {
          summary: { distance: 173000, duration: 10200 },
        },
      },
    ],
  });
});

// Manual Overpass proxy
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
