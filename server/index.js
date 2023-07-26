import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";
import booklist from "./DUMMY_DATA.js";
import Book from "./models/Book.js";

dotenv.config();

// Set strictQuery option
mongoose.set("strictQuery", true);

// Start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} on port: ${PORT}`);
    })
  );

//   .then(() => {
//     Book.countDocuments({}, (error, count) => {
//       if (error) {
//         console.error(error);
//       } else if (count === 0) {
//         Book.insertMany(booklist, (error) => {
//           if (error) {
//             console.error(error);
//           } else {
//             console.log("Books successfully saved to the database");
//           }
//         });
//       } else {
//         console.log("The books collection is not empty, books not saved");
//       }
//     });
//   })
//   .catch((error) => console.log(error));

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
