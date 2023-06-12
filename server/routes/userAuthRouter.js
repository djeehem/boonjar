import express from "express";
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/userAuthController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
// router.post("/whatever", protect, whatever);

export default router;
