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
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found");
        return res.status(BAD_REQUEST).json({ error: "User not found" });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isPasswordValid);
      if (!isPasswordValid) {
        return res.status(BAD_REQUEST).json({ error: "Invalid password" });
      }

      // Generate a JWT token if login is successful
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );
      console.log("Token generated:", token);
      res.status(OK).json({ message: "Login successful", token });
    } catch (error) {
      console.log("Error during login:", error);
      res.status(BAD_REQUEST).json({ error: "Error logging in", details: error });
    }
  }
);


/*Username Endpoiout */
router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }, "firstName lastName username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});



export default router;
