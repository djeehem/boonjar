import mongoose from "mongoose";

const userReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

const UserReview = mongoose.model("BookReviews", userReviewSchema);

export default UserReview;
