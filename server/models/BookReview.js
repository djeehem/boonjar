import mongoose from "mongoose";

const bookReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    title: {
      type: String,
      required: true,
    },
    authors: [
      {
        type: String,
        required: true,
      },
    ],
  },
  rating: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    required: true,
  },
  review: {
    title: {
      type: String,
      min: 1,
      max: 50,
    },
    review: {
      type: String,
      min: 2,
      max: 500,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // { timestamps: true }
});

const BookReview = mongoose.model("BookReviews", bookReviewSchema);

export default BookReview;
