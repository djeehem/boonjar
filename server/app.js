import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import morgan from "morgan";
import https from "https"; // for the /getMapquestCoordinates' function

import socialAuthRoutes from "./routes/socialAuthRouter.js";
import userAuthRoutes from "./routes/userAuthRouter.js";
import bookRoutes from "./routes/bookRouter.js";
import apiRoutes from "./routes/apiRouter.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import "./config/passport.js";

import multer from "multer";
import path from "path";
import { createBook } from "./controllers/bookController.js";

// Définir les options de stockage pour multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Initialiser multer avec les options de stockage
const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb){
    // TODO_COM test:
    console.log("file = ", file);
    checkFileType(file, cb);
  }
});

function checkFileType(file, cb){
  // allowed extensions:
  const filetypes = /jpeg|jpg|gif|png/;
  // check extensions:
  const extName = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime
  const mimetype = filetypes.test(file.mimetype);

  // TODO_COM test:
  console.log("in checkFileType");
  console.log("mimeType = ", mimetype);
  console.log("extName = ", extName); 

  if(mimetype && extName) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!');
  }
}

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

// photos upload with Mutler ("myPhotos" must match with <input type="file" name="myPhotos" on the client side):
app.post("/api/books", upload.array("myPhotos", 10), async (req, res) => {
  try {
    await createBook(req, res);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Error creating book" });
  }
});

// Error handling middleware
app.use(errorHandler);

// utils geocoder endpoint  
// TODO_COM verifier avec Mimi le bon endroit ou le mettre.  Devrait etre dans /utils.
app.get('/getMapquestCoordinates', async (req, res) => {
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

// utils geocoder endpoint  
// TODO_COM verifier avec Mimi le bon endroit ou le mettre.  Devrait etre dans /utils.
app.get('/get-postalCode', async (req, res) => {
  const { latitude, longitude } = req.query;
  const serverApiKey = process.env.GEOCODER_API_KEY;
     
  // Construct the URL for the MapQuest API request
  const url = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${serverApiKey}&location=${latitude},${longitude}`;
  // TODO_COM using GoogleMaps:
  // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const postalCode = JSON.parse(data).results[0].locations[0].postalCode;
        console.log("reading postalCode = ", postalCode);
        res.json({ postalCode });

      } catch (error) {
        console.error('Error parsing response data:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  }).on('error', (error) => {
    console.error('Error getting postal code:', error);
    res.status(500).json({ error: 'An error occurred' });
  });
});


// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", socialAuthRoutes);
app.use("/api/auth", userAuthRoutes);
app.use("/api/", apiRoutes);

const users = [{ name: "Peter" }, { name: "Roger" }];

app.get("/users", (req, res) => {
  res.json(users);
});

export default app;
