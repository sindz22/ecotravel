import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import overpassRouter from "./routes/overpass.js";
import airportsRouter from "./routes/airports.js";
import itinerariesRouter from './routes/itineraries.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ⭐ CORS #1 - Global
app.use(cors({
  origin: '*',  // or 'https://your-vercel-app.vercel.app' in prod
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// ⭐ Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ⭐ ROUTES
app.use('/api/user', userRoutes);
app.use('/api/auth', authRouter);
app.use('/api', overpassRouter);
app.use('/api', airportsRouter);
app.use('/api/itineraries', itinerariesRouter);

// MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecotravel";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB OK"))
  .catch(err => console.error("❌ MongoDB:", err));

// Test
app.get('/', (req, res) => res.json({ status: 'EcoTravel Backend LIVE' }));

app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));
export default app;
