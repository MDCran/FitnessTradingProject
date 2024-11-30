import express from "express";
import { NOT_FOUND, CREATED, SERVER_ERROR, OK, BAD_REQUEST } from "../util";
import { isInfoSupplied } from "../middleware"; // Import validation middleware
import Challenge from "../models/Challenge";
import { auth } from "../authMiddleware";
import User from "../models/User";
import { RemoveAllReferencesToChallengeMiddleware } from "../middleware";

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

      // Remove the challenge from activeChallenges
      user.activeChallenges = user.activeChallenges.filter(
        (id) => id.toString() !== challengeID
      );

      // Add the challenge to completedChallenges
      user.completedChallenges.push({
        challengeID,
        completedAt: new Date(),
        challengeType: challenge.challengeType,
      });

      // Add the reward points to the user's auraPoints
      user.auraPoints += challenge.reward;

      // Save the updated user document
      await user.save();

      res.status(OK).json({
        message: "Challenge completed successfully!",
        auraPoints: user.auraPoints,
      });
    } catch (error) {
      console.error("Error completing challenge:", error);
      res.status(SERVER_ERROR).json({
        error: "Couldn't complete challenge!",
        details: error.message,
      });
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


router.get("/rank", async (req, res) => {
  try {
    const users = await User.find({},{_id:0, username:true, auraPoints:true}).sort({ auraPoints: -1 });
    res.status(OK).json(users);
  } catch (error) {
    res.status(SERVER_ERROR).json({
      error: "Error fetching user rankings.",
      details: error.message,
    });
  }
});

router.get("/createdChallenges", auth, async (req: CustomRequest, res) => {
  try{
    const challenges = await Challenge.find({createdBy: req.userID});
    res.status(OK).json(challenges);
  }
  catch(error){
    res.status(SERVER_ERROR).json({
      error: "Error fetching created challenges.",
      details: error.message,
    });
  }
});


router.post("/updateChallenge", auth, isInfoSupplied("body", "challengeID", "title", "description"), async (req: CustomRequest, res) => {
  const { challengeID, title, description } = req.body;

  try {
    const challenge = await Challenge.findById(challengeID);
    if (!challenge) {
      return res.status(NOT_FOUND).json({ error: "Challenge not found." });
    }
    const user = await User.findById(req.userID);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User not found." });
    }
    if (challenge.createdBy.toString() !== req.userID) {
      return res.status(BAD_REQUEST).json({ error: "User is not the creator of the challenge." });
    }
    challenge.title = title;
    challenge.description = description;
    await challenge.save();
    res.status(OK).json({ message: "Challenge updated successfully." });
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error updating challenge.", details: error.message });
  }
});

router.post("/deleteChallenge", auth, isInfoSupplied("body", "challengeID"), RemoveAllReferencesToChallengeMiddleware, async (req: CustomRequest, res) => {
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
    if (challenge.createdBy.toString() !== req.userID) {
      return res.status(BAD_REQUEST).json({ error: "User is not the creator of the challenge." });
    }
    await challenge.delete();
    res.status(OK).json({ message: "Challenge deleted successfully." });
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error deleting challenge.", details: error.message });
  }
});

router.get("/Challenge", async (req, res) => {
  try {

    const limit = parseInt(req.query.limit as string) || 5;

    const page = parseInt(req.query.page as string)- 1 || 0;

    const search = req.query.search || "";

    // const sort = req.query.sort as string || "title";
  
    //const order = req.query.order as string || "desc";

    const challengess = await Challenge.find({ title: { $regex: search, $options: "i" },
    })
      .sort({createdAt : -1 })
      .limit(limit)
      .skip(page*limit);

      const total = await Challenge.countDocuments({
        title: {$regex: search, $options: "i"},
      });
      const response = {
        error: false,
        total: total,
        page: page + 1,
        limit: limit,
        challenges: challengess,
      }

      res.status(OK).json(response);

  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error finding challenge.", details: error.message });
  }
});

export default router;
