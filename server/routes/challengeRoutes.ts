import express from "express";
import {  NOT_FOUND, CREATED, SERVER_ERROR, OK } from "../util";
import { isInfoSupplied } from "../middleware";  // Import validation middleware
import Challenge from "../models/Challenge";
import { auth } from "../authMiddleware";
import User from "../models/User";
const router = express.Router();
interface CustomRequest extends express.Request {
  userID?: string;
}
// Register endpoint
router.post(
  "/createChallenge",
  auth,
  isInfoSupplied("body", "title", "description"),
  async (req: CustomRequest, res) => {
    const { title, description } = req.body;

    try {
      const challenge = new Challenge({ title, description, createdBy: req.userID });
      await challenge.save();
      await User.findByIdAndUpdate(
        req.userID,
        { $push: { createdChallenges: challenge._id } },
        { new: true }
      );
      res.status(CREATED).json({ message: "Challenge created successfully" });
    } catch (error) {
      res.status(SERVER_ERROR).json({ error: "Error creating user", details: error.message });
    }
  }
);

// Login endpoint
router.post(
  "/completeChallenge",
  auth,
  isInfoSupplied("body", "challengeID"),
  async (req: CustomRequest, res) => {
    const { challengeID } = req.body;
    try {
      // Find the user by username
      const challenge = await Challenge.findOne({ challengeID });
      if (!challenge) {
        console.log("Challenge not found");
        return res.status(NOT_FOUND).json({ error: "Challenge not found" });
      }

      const user = await User.findById(req.userID);
      if (!user) {
        return res.status(NOT_FOUND).json({ error: "User not found" });
      }
      user.completedChallenges.push(challengeID);
      user.totalCompleted++;
      await user.save();
      res.status(OK).json({ message: "Challenge completed successfully!" });
    } catch (error) {
      res.status(SERVER_ERROR).json({ error: "Couldn't complete challenge!", details: error.message });
    }
  }
);
/*
// Get user profile endpoint
router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }, "firstName lastName username completedChallenges createdChallenges");
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    res.status(OK).json(user);
  } catch (error) {
    res.status(SERVER_ERROR).json({ message: "Error fetching user data", details: error.message });
  }
});*/

export default router;
