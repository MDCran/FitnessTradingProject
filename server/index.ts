import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import router from "./router";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration for production
app.use(cors({
  origin: ["https://fitness-trading-project.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_SRV!)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("MongoDB connection error:", error));

// API routes
app.use("/api", router);

// Catch-all route (for non-API requests, Vercel will handle serving the frontend)
app.get("*", (req, res) => {
  res.send("API is running");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
