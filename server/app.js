import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import morgan from "morgan";

import socialAuthRoutes from "./routes/socialAuthRouter.js";
import userAuthRoutes from "./routes/userAuthRouter.js";
import bookRoutes from "./routes/bookRouter.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import "./config/passport.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(passport.initialize());
app.use(morgan("dev")); // Log HTTP requests

// Error handling middleware
app.use(errorHandler);

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", socialAuthRoutes);
app.use("/api/auth", userAuthRoutes);

const users = [{ name: "Peter" }, { name: "Roger" }];

app.get("/users", (req, res) => {
  res.json(users);
});

export default app;
