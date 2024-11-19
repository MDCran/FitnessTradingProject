import express from "express";
import {  NOT_FOUND, CREATED, SERVER_ERROR, OK } from "../util";
import { isInfoSupplied } from "../middleware";  // Import validation middleware
import Challenge from "../models/Challenge";
import { auth } from "../authMiddleware";
import User from "../models/User";
import mongoose from "mongoose";
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

// Get user profile endpoint
router.post("/updateChallenge",
  auth, //this is how you auth the route
  isInfoSupplied("body", "challengeID", "title", "description"),
  async (req: CustomRequest, res) => {
  const { challengeID,title,description } = req.body;
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
    console.log("challenge creator id", challenge.createdBy);
    console.log("current user id", user._id);
    if(challenge.createdBy.toString() !== user._id.toString()){
      return res.status(NOT_FOUND).json({ message: "You are not the creator of this challenge!" });
    }
    challenge.title = title;
    challenge.description = description;
    await challenge.save();
    res.status(OK).json({ message: "Challenge updated successfully!" });
  } catch (error) {
    res.status(SERVER_ERROR).json({ message: "Error updating challenge", details: error.message });
  }
});


/*Work here 
DeleteChallenge:
auth the route (look at the other routes for how to do this)
body: challengeID
1. Check if challenge exists
2. If it does delete challenge from database


SearchChallenge:
auth the route 
body: title
1. Find all challenges that have the title in the body
2. Return the challenges found in the response as an array 
*/

export default router;
