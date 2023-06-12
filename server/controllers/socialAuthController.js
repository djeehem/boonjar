import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const successRedirect = (req, res) => {
  res.redirect("/");
};

// Google
const googleAuthMiddleware = passport.authenticate("google", {
  scope: ["profile", "email"],
});
const googleCallbackMiddleware = passport.authenticate("google", {
  failureRedirect: "/login",
});

//Linkedin
const linkedinAuthMiddleware = passport.authenticate("linkedin", {
  state: "SOME STATE",
});
const linkedinCallbackMiddleware = passport.authenticate("linkedin", {
  failureRedirect: "/login",
});

// Facebook
const facebookAuthMiddleware = passport.authenticate("facebook", {
  scope: ["email"],
});
const facebookCallbackMiddleware = passport.authenticate("facebook", {
  failureRedirect: "/login",
});

// Twitter
const twitterAuthMiddleware = passport.authenticate("twitter");
const twitterCallbackMiddleware = passport.authenticate("twitter", {
  failureRedirect: "/login",
});

// Apple
const appleAuthMiddleware = passport.authenticate("apple");
const appleCallbackMiddleware = passport.authenticate("apple", {
  failureRedirect: "/login",
});

export {
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
};
