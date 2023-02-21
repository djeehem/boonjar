import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/books.js";
import booklist from "./DUMMY_DATA.js";
import Book from "./models/book.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/books", router);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    })
  )
  .then(() => {
    Book.countDocuments({}, (error, count) => {
      if (error) {
        console.error(error);
      } else if (count === 0) {
        Book.insertMany(booklist, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Books successfully saved to the database");
          }
        });
      } else {
        console.log("The books collection is not empty, books not saved");
      }
    });
  })
  .catch((error) => console.log(error));
