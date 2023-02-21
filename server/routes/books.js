import express from "express";

import {
  createBook,
  getBooks,
  deleteBook,
  updateBook,
  updateBookPositions,
} from "../controllers/books.js";

const router = express.Router();

router.post("/", createBook);
router.get("/:userId", getBooks);
router.delete("/:id", deleteBook);
router.patch("/:id", updateBook);
router.patch("/", updateBookPositions);

export default router;
