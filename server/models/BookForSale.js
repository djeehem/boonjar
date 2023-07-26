import mongoose from "mongoose";

// Old schema

// const forSaleBookSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   condition: {
//     type: String,
//     enum: ["good", "ok", "poor"],
//     required: true,
//   },
//   kind: {
//     type: String,
//   },
//   id: {
//     type: String,
//   },
//   etag: {
//     type: String,
//   },
//   selfLink: {
//     type: String,
//   },
//   volumeInfo: {
//     title: {
//       type: String,
//     },
//     authors: [
//       {
//         type: String,
//       },
//     ],
//     publisher: {
//       type: String,
//     },
//     publishedDate: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     industryIdentifiers: {
//       type: {
//         type: String,
//         enum: ["ISBN_13", "ISBN_10"],
//         required: true,
//       },
//       identifier: {
//         type: String,
//         validate: {
//           validator: function (v) {
//             return (
//               v &&
//               ((this.type === "ISBN_13" && v.length === 13) ||
//                 (this.type === "ISBN_10" && v.length === 10))
//             );
//           },
//           message: (props) => `${props.value} is not a valid ISBN number!`,
//         },
//       },
//     },
//     readingModes: {
//       text: {
//         type: Boolean,
//       },
//       image: {
//         type: Boolean,
//       },
//     },
//     pageCount: {
//       type: Number,
//     },
//     printType: {
//       type: String,
//     },
//     categories: [
//       {
//         type: String,
//       },
//     ],
//     averageRating: {
//       type: Number,
//     },
//     ratingsCount: {
//       type: Number,
//     },
//     maturityRating: {
//       type: String,
//     },
//     allowAnonLogging: {
//       type: Boolean,
//     },
//     contentVersion: {
//       type: String,
//     },
//     panelizationSummary: {
//       containsEpubBubbles: {
//         type: Boolean,
//       },
//       containsImageBubbles: {
//         type: Boolean,
//       },
//     },
//     imageLinks: {
//       smallThumbnail: {
//         type: String,
//       },
//       thumbnail: {
//         type: String,
//       },
//     },
//     language: {
//       type: String,
//     },
//     previewLink: {
//       type: String,
//     },
//     infoLink: {
//       type: String,
//     },
//     canonicalVolumeLink: {
//       type: String,
//     },
//   },
//   saleInfo: {
//     country: {
//       type: String,
//     },
//     saleability: {
//       type: String,
//     },
//     isEbook: {
//       type: Boolean,
//     },
//     listPrice: {
//       amount: {
//         type: Number,
//       },
//       currencyCode: {
//         type: String,
//       },
//     },
//     retailPrice: {
//       amount: {
//         type: Number,
//       },
//       currencyCode: {
//         type: String,
//       },
//     },
//     buyLink: {
//       type: String,
//     },
//   },
// });

// const ForSaleBook = mongoose.model("ForSaleBooks", forSaleBookSchema);

// export default ForSaleBook;

// adminCode: {
//     type: String,
//     required: function() {
//       return this.isAdmin;
//     }
//   }
