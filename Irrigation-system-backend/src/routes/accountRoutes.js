const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");



// Fetch user profile information
router.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "abcdefgh");
    const userId = decoded.userId;

    // Find the user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: "Invalid token." });
  }
});


// Update user personal information
router.put("/update", authenticate, async (req, res) => {
  const { firstName, lastName } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();
    res.status(200).json({ message: "Account updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Change user password
router.put("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.delete("/deleteAccount", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from the tAoken in the `authenticate` middleware

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Optionally log or send a confirmation email here

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ message: "Server error. Could not delete account." });
  }
});


module.exports = router;
