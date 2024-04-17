import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // index to search all the books for a given user
    },
    postalCode: {
      type: String,
      required: [true, 'Please add a postal code']
    },

    location: {
      type: {
        type: String,
        enum: ['Point'] // the only value possible is Point
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
    },

    condition: {
      type: String,
      enum: ["excellent", "good", "ok", "poor"],
      required: true,
    },

    price: {
      type: Number,
      required: [true, 'Please add a price']
    },

    volumeInfo: {
      title: {
        type: String,
        required: true
      },
      subtitle: {
        type: String,
      },
      authors: [
        {
          type: String,
          required: true
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
      industryIdentifiers: {
        type: {
          type: String,
          enum: ["ISBN_13", "ISBN_10"],
          //required: true,
        },
        identifier: {
          type: String,
          validate: {
            validator: function (v) {
              return ( v && v.length === 13 || v.length === 10 );
            },
            message: (props) => `${props.value} is not a valid ISBN number!`,
          },
        },
      },
      pageCount: {
        type: Number,
      },
      categories: [
        {
          type: String,
        },
      ],
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
    },

    amazonLink: {
      type: String,
    },

    // photos taken by the user
    photos: [{
      type: String,
    }],
  
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Add Index for geospatial search
  BookSchema.index({ "location.coordinates": "2dsphere" });
   
const Book = mongoose.model("Book", BookSchema);
export default Book;