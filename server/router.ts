import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User";
import { BAD_REQUEST, CREATED, OK } from "./util";
import { isInfoSupplied } from "./middleware";  // Import validation middleware

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
      res.status(BAD_REQUEST).json({ error: "Error creating user", details: error });
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
      if (!user) return res.status(BAD_REQUEST).json({ error: "User not found" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(BAD_REQUEST).json({ error: "Invalid password" });

      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      res.status(OK).json({ message: "Login successful", token });
    } catch (error) {
      res.status(BAD_REQUEST).json({ error: "Error logging in", details: error });
    }
  }
);

export default router;
