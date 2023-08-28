import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import morgan from "morgan";
import https from "https"; // for the /get-lat-long' function

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

// utils geocoder endpoint
// TODO_COM verifier avec Mimi le bon endroit ou le mettre
app.get('/get-lat-long', async (req, res) => {
  const postalCode = req.query.postalCode;
  const serverApiKey = process.env.GEOCODER_API_KEY;

  // Construct the URL for the MapQuest API request
  const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${serverApiKey}&location=${postalCode}&countryCode=CA`;

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const latLng = JSON.parse(data).results[0].locations[0].latLng;
        res.json(latLng);

      } catch (error) {
        console.error('Error parsing response data:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  }).on('error', (error) => {
    console.error('Error getting lat/long:', error);
    res.status(500).json({ error: 'An error occurred' });
  });
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", socialAuthRoutes);
app.use("/api/auth", userAuthRoutes);

const users = [{ name: "Peter" }, { name: "Roger" }];

app.get("/users", (req, res) => {
  res.json(users);
});

export default app;
