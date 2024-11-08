// server/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./router";

dotenv.config();

const app = express();
app.use(express.json());

// CORS middleware should come before routes
app.use(cors({
  origin: "*",  // Allow frontend's origin
  methods: ["GET", "POST"],         // Allow specific HTTP methods
  credentials: true                 // Allow cookies or authorization headers if needed
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("MongoDB connection error:", error));

// Use API routes
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
