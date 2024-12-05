import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, SERVER_ERROR } from "../util";
import { isInfoSupplied } from "../middleware";

const router = express.Router();

// Register endpoint
router.post(
  "/register",
  isInfoSupplied("body", "firstName", "lastName", "username", "password", "confirmPassword"),
  async (req, res) => {
    const { firstName, lastName, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(BAD_REQUEST).json({ error: "Passwords do not match" });
    }

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(BAD_REQUEST).json({ error: "Username is already taken. Please try another one." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ firstName, lastName, username, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      res.status(CREATED).json({ message: "Account created successfully", token });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(SERVER_ERROR).json({ error: "Error creating user", details: error.message });
    }
  }
);

// Login endpoint
router.post(
  "/login",
  isInfoSupplied("body", "username", "password"),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(NOT_FOUND).json({ error: "No account found with this username." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(BAD_REQUEST).json({ error: "Incorrect password. Please try again." });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(OK).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(SERVER_ERROR).json({ error: "Error logging in", details: error.message });
    }
  }
);

// User profile endpoint
router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    console.log("let's find it");
    const user = await User.findOne(
      { username },
      "firstName lastName username auraPoints activeChallenges completedChallenges"
    )
      .populate("activeChallenges", "title description expiresAt challengeType")
      .populate({
        path: "completedChallenges.challengeID",
        select: "title description",
        model: "Challenge",
      });
    
    console.log("found and populated");

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found." });
    }

    console.log("user found");

    const formattedUser = {
      ...user.toObject(),
      completedChallenges: user.completedChallenges.map((completed) => ({
        challengeID: (completed.challengeID as any)?._id,
        title: (completed.challengeID as any)?.title,
        description: (completed.challengeID as any)?.description,
        completedAt: completed.completedAt,
        challengeType: completed.challengeType,
      })),
    };

    console.log("formatted; sending to frontend");

    res.status(OK).json(formattedUser);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(SERVER_ERROR).json({
      error: "An error occurred while fetching user data.",
      details: error.message,
    });
  }
});

router.get("/user", async (req, res) => {
  try {

    const limit = parseInt(req.query.limit as string) || 5;

    const page = parseInt(req.query.page as string)- 1 || 0;

    const search = req.query.search || "";

    // const sort = req.query.sort as string || "title";
  
    //const order = req.query.order as string || "desc";

    const userss = await User.find({ title: { $regex: search, $options: "i" },
    })
      .sort({username : -1 })
      .limit(limit)
      .skip(page*limit);

      const total = await User.countDocuments({
        title: {$regex: search, $options: "i"},
      });
      const response = {
        error: false,
        total: total,
        page: page + 1,
        limit: limit,
        users: userss,
      }

      res.status(OK).json(response);

  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error finding users.", details: error.message });
  }
});

router.get("/userIDFromName/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne(
      { username }
    )
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found." });
    }
    res.status(OK).json(user._id);
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error logging userID.", details: error.message });
  }
});


export default router;
