import axios from "axios";

import { sendPasswordResetEmail } from "../utils/email.js";
import User from "../models/User.js";
import bcrypt from "../utils/bcrypt.js";
import {
  generateAccessJwt,
  generateRefreshJwt,
  verifyAccessJwt,
  verifyRefreshJwt,
  generatePasswordResetJwt,
  verifyPasswordResetJwt,
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
    const accessToken = generateAccessJwt(newUser);

    const refreshToken = generateRefreshJwt(newUser);

    res.status(201).json({ accessToken, refreshToken });
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

    // TODO_COM test: 
    console.log("in userAuthController USER = ", user);

    // TODO_COM @Mimi: ca ne fonctionne pas avec erreur secretOrPrivateKey must have a value
    //TODO_COM remettre const accessToken = generateAccessJwt(user);
    //TODO_COM remettre const refreshToken = generateRefreshJwt(user);

    //TODO_COM remettre res.status(200).json({ accessToken, refreshToken });
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  console.log(accessToken);

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }

  try {
    const decodedToken = verifyAccessJwt(accessToken);
    // Additional logic if needed
    res
      .status(200)
      .json({ message: "JWT verification successful", decodedToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    // Verify and decode the refresh token
    const decodedRefreshToken = verifyRefreshJwt(refreshToken);

    // Generate a new access token
    const accessToken = generateAccessJwt(decodedRefreshToken);

    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

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
    const token = generatePasswordResetJwt(user);

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
    const decodedToken = verifyPasswordResetJwt(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Update user password
    const user = await User.findById(decodedToken.id);
    const hashedPassword = await bcrypt.hash(password);
    user.password = hashedPassword;
    await user.save();

    // Generate JWT token
    const accessToken = generateAccessJwt(user);

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  verifyToken,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
