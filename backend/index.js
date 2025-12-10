import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);
// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.listen(5000, () => console.log("Server running on port 5000"));
