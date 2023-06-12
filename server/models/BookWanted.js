import mongoose from "mongoose";

const wantedBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  condition: {
    type: String,
  },
  kind: {
    type: String,
  },
  id: {
    type: String,
  },
  etag: {
    type: String,
  },
  selfLink: {
    type: String,
  },
  volumeInfo: {
    title: {
      type: String,
    },
    authors: [
      {
        type: String,
      },
    ],
    publisher: {
      type: String,
    },
    publishedDate: {
      type: String,
    },
    description: {
      type: String,
    },
    industryIdentifiers: [
      {
        type: "ISBN_13",
        identifier: {
          type: String,
          validate: {
            validator: function (v) {
              return v && v.length === 13;
            },
            message: (props) => `${props.value} is not a valid ISBN-13 number!`,
          },
        },
      },
      {
        type: "ISBN_10",
        identifier: {
          type: String,
          validate: {
            validator: function (v) {
              return v && v.length === 10;
            },
            message: (props) => `${props.value} is not a valid ISBN-10 number!`,
          },
        },
      },
    ],
    readingModes: {
      text: {
        type: Boolean,
      },
      image: {
        type: Boolean,
      },
    },
    pageCount: {
      type: Number,
    },
    printType: {
      type: String,
    },
    categories: [
      {
        type: String,
      },
    ],
    averageRating: {
      type: Number,
    },
    ratingsCount: {
      type: Number,
    },
    maturityRating: {
      type: String,
    },
    allowAnonLogging: {
      type: Boolean,
    },
    contentVersion: {
      type: String,
    },
    panelizationSummary: {
      containsEpubBubbles: {
        type: Boolean,
      },
      containsImageBubbles: {
        type: Boolean,
      },
    },
    imageLinks: {
      smallThumbnail: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
    },
    language: {
      type: String,
    },
    previewLink: {
      type: String,
    },
    infoLink: {
      type: String,
    },
    canonicalVolumeLink: {
      type: String,
    },
  },
  saleInfo: {
    country: {
      type: String,
    },
    saleability: {
      type: String,
    },
    isEbook: {
      type: Boolean,
    },
    listPrice: {
      amount: {
        type: Number,
      },
      currencyCode: {
        type: String,
      },
    },
    retailPrice: {
      amount: {
        type: Number,
      },
      currencyCode: {
        type: String,
      },
    },
    buyLink: {
      type: String,
    },
  },
});

const WantedBook = mongoose.model("WantedBooks", wantedBookSchema);

export default WantedBook;

// adminCode: {
//     type: String,
//     required: function() {
//       return this.isAdmin;
//     }
//   }
