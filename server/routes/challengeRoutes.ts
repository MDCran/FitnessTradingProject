import express from "express";
import { NOT_FOUND, CREATED, SERVER_ERROR, OK, BAD_REQUEST } from "../util";
import { isInfoSupplied } from "../middleware"; // Import validation middleware
import Challenge from "../models/Challenge";
import { auth } from "../authMiddleware";
import User from "../models/User";

const router = express.Router();

interface CustomRequest extends express.Request {
  userID?: string;
}

// Create a new challenge
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
        challengeType,
        createdBy: req.userID,
      });
      await challenge.save();

      res.status(CREATED).json({ message: "Challenge created successfully" });
    } catch (error) {
      res.status(SERVER_ERROR).json({ error: "Error creating challenge", details: error.message });
    }
  }
);

// Join a challenge
router.post("/joinChallenge", auth, isInfoSupplied("body", "challengeID"), async (req: CustomRequest, res) => {
  const { challengeID } = req.body;

  try {
    const challenge = await Challenge.findById(challengeID);
    if (!challenge) {
      return res.status(NOT_FOUND).json({ error: "Challenge not found." });
    }

    const user = await User.findById(req.userID);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User not found." });
    }

    // Prevent joining completed challenges
    if (user.completedChallenges.some((c) => c.challengeID.toString() === challengeID)) {
      return res.status(BAD_REQUEST).json({ error: "Challenge already completed." });
    }

    // Prevent joining already active challenges
    if (user.activeChallenges.includes(challengeID)) {
      return res.status(BAD_REQUEST).json({ error: "Challenge already active." });
    }

    // Ensure the challenge is not expired
    if (challenge.expiresAt <= new Date()) {
      return res.status(BAD_REQUEST).json({ error: "Challenge has expired." });
    }

    user.activeChallenges.push(challengeID);
    await user.save();

    return res.status(OK).json({ message: "Challenge joined successfully." });
  } catch (error) {
    console.error("Error processing joinChallenge:", error);
    return res.status(SERVER_ERROR).json({ error: "Error joining challenge.", details: error.message });
  }
});


// Complete a challenge
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

      // Prevent re-completion of a challenge
      if (user.completedChallenges.some((c) => c.challengeID.toString() === challengeID)) {
        return res.status(BAD_REQUEST).json({ error: "Challenge already completed." });
      }

      user.activeChallenges = user.activeChallenges.filter(
        (id) => id.toString() !== challengeID
      );
      user.completedChallenges.push({
        challengeID,
        completedAt: new Date(),
        challengeType: challenge.challengeType,
      });

      await user.save();

      res.status(OK).json({ message: "Challenge completed successfully!" });
    } catch (error) {
      res
        .status(SERVER_ERROR)
        .json({ error: "Couldn't complete challenge!", details: error.message });
    }
  }
);

router.get("/activeChallenges", async (req, res) => {
  try {
    const challenges = await Challenge.find({ expiresAt: { $gt: new Date() } });
    res.status(OK).json(challenges);
  } catch (error) {
    res.status(SERVER_ERROR).json({
      error: "Error fetching active challenges.",
      details: error.message,
    });
  }
});


export default router;
