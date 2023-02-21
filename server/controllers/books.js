import mongoose from "mongoose";
import Book from "../models/book.js";

// const newBook = new Book({
//   title: "The Great Gatsby",
//   author: "F. Scott Fitzgerald",
//   publicationDate: new Date(1925, 4, 10),
//   genre: "Novel",
//   price: 12.99,
//   description: "A classic novel about the decadence of the Jazz Age.",
//   coverImage: "https://example.com/great-gatsby-cover.jpg",
// });

const createBook = async (req, res) => {
  const book = req.body;

  const newBook = new Book(book);

  try {
    // await Book.updateMany({}, { $inc: { position: 1 } });

    await newBook.save();

    res.status(201).json({
      status: 201,
      data: newBook,
    });
  } catch (error) {
    res.status(409).json({
      status: 409,
      message: error,
    });
  }
};

const getBooks = async (req, res) => {
  const userId = req.params;
  try {
    const books = await Book.find(userId).exec();

    res.status(200).json({
      status: 200,
      data: books,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error,
    });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No book found with that id");
  }

  await Book.findByIdAndRemove(id);

  res.json({
    Message: "Book deleted",
  });
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, book, bookColor, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No book found with that id");
  }

  const updatedBook = {
    title,
    book,
    bookColor,
    email,
    _id: id,
  };

  await Book.findByIdAndUpdate(id, updatedBook, { new: true });

  res.json(updatedBook);
};

const updateBookPositions = async (req, res) => {
  const books = req.body;

  await books.map(async (book) => {
    await Book.updateOne(
      { _id: book._id },
      { $set: { position: book.position } }
    );
  });
};

export { createBook, getBooks, deleteBook, updateBook, updateBookPositions };
