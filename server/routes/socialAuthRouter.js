import express from "express";

const router = express.Router();

import {
  successRedirect,
  googleAuthMiddleware,
  googleCallbackMiddleware,
  linkedinAuthMiddleware,
  linkedinCallbackMiddleware,
  facebookAuthMiddleware,
  facebookCallbackMiddleware,
  twitterAuthMiddleware,
  twitterCallbackMiddleware,
  appleAuthMiddleware,
  appleCallbackMiddleware,
} from "../controllers/socialAuthController.js";

router.get("/google", googleAuthMiddleware);
router.get("/google/callback", googleCallbackMiddleware, successRedirect);

router.get("/linkedin", linkedinAuthMiddleware);
router.get("/linkedin/callback", linkedinCallbackMiddleware, successRedirect);

router.get("/facebook", facebookAuthMiddleware);
router.get("/facebook/callback", facebookCallbackMiddleware, successRedirect);

router.get("/twitter", twitterAuthMiddleware);
router.get("/twitter/callback", twitterCallbackMiddleware, successRedirect);

router.get("/apple", appleAuthMiddleware);
router.get("/apple/callback", appleCallbackMiddleware, successRedirect);

export default router;
