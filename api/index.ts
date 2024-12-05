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
import challengeRoutes from "../server/routes/challengeRoutes";
import { expireChallengesMiddleware } from "../server/middleware"; // Import the middleware
import Challenge from "../server/models/Challenge";

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

// Function to create a test challenge
const createTestChallenges = async () => {

  try {
    // Define test challenges
    const testChallenges = [
      // Weekly challenges
      { title: "Weekly Challenge 1", description: "Complete 5 miles of running this week.", challengeType: "weekly", reward: 100 },
      { title: "Weekly Challenge 2", description: "Cook three healthy meals.", challengeType: "weekly", reward: 75 },
      { title: "Weekly Challenge 3", description: "Read a book for 5 hours.", challengeType: "weekly", reward: 120 },
      { title: "Weekly Challenge 4", description: "Burn 2,000 calories through exxcercise alone.", challengeType: "weekly", reward: 85 },
      { title: "Weekly Challenge 5", description: "Find a workout buddy and complete 3 workouts together.", challengeType: "weekly", reward: 100 },
      // Daily challenges
      { title: "Daily Challenge 1", description: "Drink 8 glasses of water.", challengeType: "daily", reward: 20 },
      { title: "Daily Challenge 2", description: "Meditate for 10 minutes.", challengeType: "daily", reward: 25 },
      { title: "Daily Challenge 3", description: "Do 30 pushups.", challengeType: "daily", reward: 30 },
      { title: "Daily Challenge 4", description: "Write in a gratitude journal.", challengeType: "daily", reward: 15 },
      { title: "Daily Challenge 5", description: "Take a 20-minute walk.", challengeType: "daily", reward: 20 },
    ];

    // Iterate over each challenge and create it if it doesn't already exist
    for (const challengeData of testChallenges) {
      const existingChallenge = await Challenge.findOne({ title: challengeData.title });

      if (!existingChallenge) {
        console.log(`Creating test challenge: ${challengeData.title}`);

        // Create a new challenge
        const testChallenge = new Challenge({
          title: challengeData.title,
          description: challengeData.description,
          challengeType: challengeData.challengeType,
          reward: challengeData.reward,
          createdBy: new mongoose.Types.ObjectId(), // Replace with a valid user ID if needed
        });

        await testChallenge.save();
        console.log(`Test challenge created successfully: ${testChallenge.title}`);
      } else {
        console.log(`Test challenge already exists: ${challengeData.title}`);
      }
    }
  } catch (error) {
    console.error("Error creating test challenges:", error);
  }
};


// Connect to MongoDB and initialize the application
const mongoClient = mongoose
  .connect(MONGO_URL)
  .then(async (mongo) => {
    console.log("Connected to MongoDB database.");
    await createTestChallenges(); // Call the function to create test challenges
    return mongo.connection.getClient();
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB database: ${error}`);
    throw new Error(error.message);
  });


const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [API_URL], // Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

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

// Expire challenges middleware
app.use(expireChallengesMiddleware); // Add this line

// API routes
const API_PREFIX = "/api";
app.use(API_PREFIX, userRoutes);
app.use(API_PREFIX, challengeRoutes);

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
