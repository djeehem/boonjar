import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as AppleStrategy } from "passport-apple";

import User from "../models/User.js";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) return done(null, false, { message: "Invalid email" });

        const isMatch = await user.comparePassword(password);

        if (!isMatch)
          return done(null, false, { message: "Invalid email or password" });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret",
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) return done(null, existingUser);
        const newUser = new User({
          google: {
            id: profile.id,
            email: profile.emails[0].value,
          },
          displayName: profile.displayName,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// LinkedIn strategy
// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: `${process.env.BASE_URL}/api/auth/linkedin/callback`,
//       scope: ["r_emailaddress", "r_liteprofile"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ "linkedin.id": profile.id });
//         if (existingUser) return done(null, existingUser);
//         const newUser = new User({
//           linkedin: {
//             id: profile.id,
//             email: profile.emails[0].value,
//           },
//           displayName: profile.displayName,
//         });
//         await newUser.save();
//         return done(null, newUser);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// Facebook strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
//       profileFields: ["id", "emails", "name"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ "facebook.id": profile.id });
//         if (existingUser) return done(null, existingUser);
//         const newUser = new User({
//           facebook: {
//             id: profile.id,
//             email: profile.emails[0].value,
//           },
//           displayName: `${profile.name.givenName} ${profile.name.familyName}`,
//         });
//         await newUser.save();
//         return done(null, newUser);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// Twitter strategy
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_API_KEY,
//       consumerSecret: process.env.TWITTER_API_SECRET,
//       callbackURL: `${process.env.BASE_URL}/api/auth/twitter/callback`,
//       includeEmail: true,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ "twitter.id": profile.id });
//         if (existingUser) return done(null, existingUser);
//         const newUser = new User({
//           twitter: {
//             id: profile.id,
//             email: profile.emails[0].value,
//           },
//           displayName: profile.displayName,
//         });
//         await newUser.save();
//         return done(null, newUser);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// Apple strategy
// passport.use(
//   new AppleStrategy(
//     {
//       clientID: process.env.APPLE_CLIENT_ID,
//       teamID: process.env.APPLE_TEAM_ID,
//       keyID: process.env.APPLE_KEY_ID,
//       privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
//       callbackURL: `${process.env.BASE_URL}/api/auth/apple/callback`,
//     },
//     async (accessToken, refreshToken, idToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ "apple.id": profile.id });
//         if (existingUser) return done(null, existingUser);
//         const newUser = new User({
//           apple: {
//             id: profile.id,
//             email: profile.email,
//           },
//           displayName: `${profile.firstName} ${profile.lastName}`,
//         });
//         await newUser.save();
//         return done(null, newUser);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );
