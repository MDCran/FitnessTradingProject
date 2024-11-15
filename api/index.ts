import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import * as dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import MongoStore from "connect-mongo";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { SERVER_ERROR } from "../server/util";
import userRoutes from "../server/routes/userRoutes";

dotenv.config();

// MongoDB connection setup
const MONGO_URL = process.env.MONGO_SRV;
if (!MONGO_URL) {
  throw new Error("MONGO_SRV is not defined in .env file!");
}
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error("REACT_APP_API_URL is not defined in .env file!");
}
const mongoClient = mongoose
  .connect(MONGO_URL)
  .then((mongo) => {
    console.log("Connected to MongoDB database.");
    return mongo.connection.getClient();
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB database: ${error}`);
    throw new Error(error.message);
  });

const app = express();

app.use(express.json());
app.use(cors({
  origin: [API_URL],  // Replace with your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));



app.use(logger("dev"));
app.use(ExpressMongoSanitize());
app.set("port", process.env.PORT ?? 8000);

// Session setup with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "default_secret",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: mongoClient,
      dbName: "sessions",
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),
  })
);

// API routes
const API_PREFIX = "/api";
app.use(API_PREFIX, userRoutes);
// Serve static files from React app
const buildDir = path.join(__dirname, "..", "client", "build");
app.use(express.static(buildDir));

// Catch-all route for serving React's index.html
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(SERVER_ERROR).send({ error: "Server error" });
});

// Start the server
const server = http.createServer(app);
server.listen(app.get("port"), () => {
  console.log(`Server running on port: ${app.get("port")}`);
});
