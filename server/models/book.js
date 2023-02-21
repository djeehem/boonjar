import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: [String],
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  isbn: {
    type: [Number],
  },
  language: {
    type: String,
  },
  pages: {
    type: Number,
  },
  publisher: {
    type: String,
  },
  publicationDate: {
    type: Date,
  },
  edition: {
    type: String,
  },
  genre: {
    type: String,
  },
  description: {
    type: String,
  },
  coverImage: {
    type: String,
  },
});

const Book = mongoose.model("books", bookSchema);

export default Book;
