import axios from "axios";

import { sendPasswordResetEmail } from "../utils/email.js";
import User from "../models/User.js";
import bcrypt from "../utils/bcrypt.js";
import {
  generateToken,
  verifyToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from "../utils/jwt.js";

// Register a new user
const register = async (req, res, next) => {
  try {
    const { email, password, location } = req.body;

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password);

    const newUser = new User({
      email,
      password: hashedPassword,
      location,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    next(error);
  }
};

// Logout user
const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// Forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate password reset token
    const token = generatePasswordResetToken(user);

    // Send password reset email
    sendPasswordResetEmail(user, token);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Verify password reset token
    const decodedToken = verifyPasswordResetToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Update user password
    const user = await User.findById(decodedToken.id);
    const hashedPassword = await bcrypt.hash(password);
    user.password = hashedPassword;
    await user.save();

    // Generate JWT token
    const authToken = generateToken(user);

    res.status(200).json({ token: authToken });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, forgotPassword, resetPassword };
