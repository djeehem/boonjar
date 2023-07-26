import express from "express";

import {
  createBook,
  getBooksNearMe,
  getMyBooks,
  deleteBook,
  updateBook,
  updateBookPositions,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/", createBook);
router.get("/near", getBooksNearMe);
router.get("/:userId", getMyBooks);
router.delete("/:id", deleteBook);
router.patch("/:id", updateBook);
router.patch("/", updateBookPositions);

export default router;
