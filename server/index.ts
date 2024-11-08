import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./router";  // Import your API routes

dotenv.config();

const app = express();
app.use(express.json());

// Set up CORS to allow localhost and Vercel frontend
app.use(cors({
  origin: ["http://localhost:3000", "https://fitness-trading-project.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("MongoDB connection error:", error));

// Use API routes
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
