// server/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  // Import CORS
import router from "./router";

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS to allow requests from your frontend origin
app.use(cors({
  origin: "http://localhost:3000",  // Replace with your frontend's origin
  methods: ["GET", "POST"],         // Specify allowed methods
  credentials: true                 // Include credentials if needed
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
