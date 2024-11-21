import express from "express";
import { NOT_FOUND, CREATED, SERVER_ERROR, OK, BAD_REQUEST } from "../util";
import { isInfoSupplied } from "../middleware"; // Import validation middleware
import Challenge from "../models/Challenge";
import { auth } from "../authMiddleware";
import User from "../models/User";
import mongoose from "mongoose";

const router = express.Router();

interface CustomRequest extends express.Request {
  userID?: string;
}

// Create a new challenge
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
      res.status(SERVER_ERROR).json({ error: "Error creating challenge", details: error.message });
    }
  }
);

// Mark a challenge as completed
router.post(
  "/completeChallenge",
  auth,
  isInfoSupplied("body", "challengeID"),
  async (req: CustomRequest, res) => {
    const { challengeID } = req.body;

    try {
      const challenge = await Challenge.findById(challengeID);
      if (!challenge) {
        return res.status(NOT_FOUND).json({ error: "Challenge not found" });
      }

      const user = await User.findById(req.userID);
      if (!user) {
        return res.status(NOT_FOUND).json({ error: "User not found" });
      }

      // Ensure the challenge is in activeChallenges
      if (!user.activeChallenges.includes(challengeID)) {
        return res.status(BAD_REQUEST).json({ error: "Challenge is not active." });
      }

      // Check if the challenge has already been completed
      if (user.completedChallenges.includes(challengeID)) {
        return res.status(BAD_REQUEST).json({ error: "Challenge is already completed." });
      }

      // Move the challenge from active to completed
      user.activeChallenges = user.activeChallenges.filter(
        (id) => id.toString() !== challengeID
      );
      user.completedChallenges.push(challengeID);

      // Update aura points and total completed
      user.auraPoints += challenge.reward;
      user.totalCompleted += 1;

      await user.save();

      res.status(OK).json({
        message: "Challenge completed successfully!",
        auraPoints: user.auraPoints,
      });
    } catch (error) {
      res
        .status(SERVER_ERROR)
        .json({ error: "Couldn't complete challenge!", details: error.message });
    }
  }
);


// Update a challenge
router.post(
  "/updateChallenge",
  auth,
  isInfoSupplied("body", "challengeID", "title", "description"),
  async (req: CustomRequest, res) => {
    const { challengeID, title, description } = req.body;
    try {
      const objChallengeID = new mongoose.Types.ObjectId(challengeID);
      const challenge = await Challenge.findById(objChallengeID);
      if (!challenge) {
        return res.status(NOT_FOUND).json({ message: "Challenge not found" });
      }
      const user = await User.findById(req.userID);
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      if (challenge.createdBy.toString() !== user._id.toString()) {
        return res.status(NOT_FOUND).json({ message: "You are not the creator of this challenge!" });
      }
      challenge.title = title;
      challenge.description = description;
      await challenge.save();
      res.status(OK).json({ message: "Challenge updated successfully!" });
    } catch (error) {
      res.status(SERVER_ERROR).json({ message: "Error updating challenge", details: error.message });
    }
  }
);

// Delete a challenge
router.delete(
  "/deleteChallenge",
  auth,
  isInfoSupplied("body", "challengeID"),
  async (req: CustomRequest, res) => {
    const { challengeID } = req.body;
    try {
      const objChallengeID = new mongoose.Types.ObjectId(challengeID);
      const challenge = await Challenge.findById(objChallengeID);

      if (!challenge) {
        return res.status(NOT_FOUND).json({ error: "Challenge not found" });
      }

      const user = await User.findById(req.userID);
      if (!user) {
        return res.status(NOT_FOUND).json({ error: "User not found" });
      }

      if (challenge.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized to delete this challenge" });
      }

      await Challenge.findByIdAndDelete(objChallengeID);

      await User.findByIdAndUpdate(
        req.userID,
        { $pull: { createdChallenges: objChallengeID } },
        { new: true }
      );

      res.status(OK).json({ message: "Challenge deleted successfully!" });
    } catch (error) {
      res.status(SERVER_ERROR).json({ error: "Error deleting challenge", details: error.message });
    }
  }
);

// Search challenges
router.post(
  "/searchChallenge",
  auth,
  isInfoSupplied("body", "title"),
  async (req: CustomRequest, res) => {
    const { title } = req.body;

    try {
      const challenges = await Challenge.find({
        title: { $regex: new RegExp(title, "i") }, // Case-insensitive search
      });

      if (challenges.length === 0) {
        return res.status(NOT_FOUND).json({ message: "No challenges found" });
      }

      res.status(OK).json(challenges);
    } catch (error) {
      res
        .status(SERVER_ERROR)
        .json({ error: "Error searching challenges", details: error.message });
    }
  }
);

// Get active challenges
router.get("/activeChallenges", async (req, res) => {
  try {
    const currentDate = new Date();
    const challenges = await Challenge.find({ expiresAt: { $gt: currentDate } });

    res.status(OK).json(challenges);
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error fetching active challenges", details: error.message });
  }
});

// Join a challenge
router.post("/joinChallenge", auth, isInfoSupplied("body", "challengeID"), async (req: CustomRequest, res) => {
  const { challengeID } = req.body;

  try {
    const challenge = await Challenge.findById(challengeID);

    if (!challenge) {
      return res.status(NOT_FOUND).json({ error: "Challenge not found" });
    }

    const user = await User.findById(req.userID);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User not found" });
    }

    // Check if the challenge is already completed
    if (user.completedChallenges.includes(challengeID)) {
      return res.status(BAD_REQUEST).json({ error: "Challenge is already completed." });
    }

    // Ensure the challenge is not expired
    if (challenge.expiresAt <= new Date()) {
      return res.status(BAD_REQUEST).json({ error: "Challenge has expired and cannot be joined." });
    }

    // Check if already joined
    if (user.activeChallenges.includes(challengeID)) {
      return res.status(BAD_REQUEST).json({ error: "Challenge already active." });
    }

    user.activeChallenges.push(challengeID);
    await user.save();

    res.status(OK).json({ message: "Challenge joined successfully." });
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error joining challenge", details: error.message });
  }
});


export default router;
