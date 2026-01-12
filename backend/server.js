import express from "express";
import cors from "cors";  // ✅ ESM import
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Routes
import authRouter from "./routes/auth.js";
import overpassRouter from "./routes/overpass.js";
import airportsRouter from "./routes/airports.js";
import itinerariesRouter from './routes/itineraries.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIXED - SINGLE BLOCK FIRST
app.use(cors({
  origin: "*",           // Allow Vercel + localhost
  credentials: true
}));

// ✅ Body parser AFTER CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ALL ROUTES
app.use('/api/user', userRoutes);
app.use("/api/auth", authRouter);
app.use("/api", overpassRouter);
app.use("/api", airportsRouter);
app.use('/api/itineraries', itinerariesRouter);

// MongoDB (unchanged)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecotravel";
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes (unchanged)
app.get("/", (req, res) => res.send("EcoTravel backend running"));
app.post("/route", (req, res) => { /* unchanged */ });
app.post("/overpass", async (req, res) => { /* unchanged */ });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
