import express from "express";
import { NOT_FOUND, CREATED, SERVER_ERROR, OK, BAD_REQUEST } from "../util";
import { isInfoSupplied } from "../middleware";
import Challenge from "../models/Challenge";
import { auth } from "../authMiddleware";
import User from "../models/User";

const router = express.Router();

interface CustomRequest extends express.Request {
  userID?: string;
}

// Create Challenge
router.post(
  "/createChallenge",
  auth,
  isInfoSupplied("body", "title", "description", "challengeType"),
  async (req: CustomRequest, res) => {
    const { title, description, challengeType } = req.body;

    try {
      const challenge = new Challenge({
        title,
        description,
        createdBy: req.userID,
        challengeType,
      });
      await challenge.save();

      res.status(CREATED).json({ message: "Challenge created successfully" });
    } catch (error) {
      res.status(SERVER_ERROR).json({ error: "Error creating challenge", details: error.message });
    }
  }
);

// Mark Challenge as Completed
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

      if (!user.activeChallenges.includes(challengeID)) {
        return res.status(BAD_REQUEST).json({ error: "Challenge is not active." });
      }

      if (
        user.completedChallenges.some((c) => c.challengeID.toString() === challengeID)
      ) {
        return res.status(BAD_REQUEST).json({ error: "Challenge already completed." });
      }

      const completionDate = new Date();
      user.completedChallenges.push({
        challengeID,
        completedAt: completionDate,
        challengeType: challenge.challengeType,
      });
      user.activeChallenges = user.activeChallenges.filter(
        (id) => id.toString() !== challengeID
      );
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

// Get Active Challenges
router.get("/activeChallenges", async (req, res) => {
  try {
    const currentDate = new Date();
    const challenges = await Challenge.find({ expiresAt: { $gt: currentDate } });

    res.status(OK).json(challenges);
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error fetching active challenges", details: error.message });
  }
});

export default router;
