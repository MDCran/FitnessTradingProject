import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, SERVER_ERROR } from "../util";
import { isInfoSupplied } from "../middleware";  // Import validation middleware

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
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ firstName, lastName, username, password: hashedPassword });
      await user.save();
      res.status(CREATED).json({ message: "Account created successfully" });
    } catch (error) {
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
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found");
        return res.status(NOT_FOUND).json({ error: "User not found" });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(BAD_REQUEST).json({ error: "Invalid password" });
      }

      // Generate a JWT token if login is successful
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );
      res.status(OK).json({ message: "Login successful", token });
    } catch (error) {
      res.status(SERVER_ERROR).json({ error: "Error logging in", details: error.message });
    }
  }
);

// Get user profile endpoint
router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await 
    User.findOne({ username }, "firstName lastName username completedChallenges createdChallenges")
    .populate("completedChallenges", "title description")
    .populate("createdChallenges", "title description");
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    
    res.status(OK).json(user);
  } catch (error) {
    res.status(SERVER_ERROR).json({ message: "Error fetching user data", details: error.message });
  }
});

export default router;
