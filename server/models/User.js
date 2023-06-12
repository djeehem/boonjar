import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  location: {
    // street: { type: String, default: "" },
    // city: { type: String, default: "" },
    // state: { type: String, default: "" },
    // country: { type: String, default: "" },
    address: { type: String, required: true },
    coordinates: {
      longitude: { type: String, default: "" },
      latitude: { type: String, default: "" },
    },
  },
  // username: {
  //   type: String,
  //   min: 2,
  //   max: 25,
  //   required: true,
  //   unique: true,
  // },
  // social: {
  //   isSocial: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   socialId: {
  //     type: String,
  //     required: function () {
  //       return this.social && this.social.isSocial;
  //     },
  //   },
  //   socialProvider: {
  //     type: String,
  //     required: function () {
  //       return this.social && this.social.isSocial;
  //     },
  //   },
  // },
  // accessToken: {
  //   type: String,
  //   required: false,
  // },
  // refreshToken: {
  //   type: String,
  //   required: false,
  // },
  // firstName: {
  //   type: String,
  //   max: 20,
  //   required: true,
  // },
  // lastName: {
  //   type: String,
  //   max: 20,
  //   required: true,
  // },
  // dateOfBirth: {
  //   type: Date,
  // },
  // gender: {
  //   type: String,
  //   enum: ["Male", "Female", "Other"],
  // },
  // phoneNumber: {
  //   type: String,
  //   default: "",
  // },
  // from: {
  //   type: String,
  //   max: 50,
  // },
  // profilePicture: {
  //   type: String,
  //   default: "",
  // },
  // coverPicture: {
  //   type: String,
  //   default: "",
  // },
  // desc: {
  //   type: String,
  //   max: 100,
  //   default: "",
  // },
  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // },
  // wishlist: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "WantedBook",
  //   },
  // ],
  // sellingBooks: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "ForSaleBook",
  //   },
  // ],
  // bookCart: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Book",
  //   },
  // ],
  // purchasedBooks: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Book",
  //   },
  // ],
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // updatedAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // { timestamps: true }
});

const User = mongoose.model("User", userSchema);

export default User;
