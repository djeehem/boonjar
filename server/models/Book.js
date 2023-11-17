import mongoose from "mongoose";
import geocoder from "../utils/geocoder.js";

const BookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // index to search all the books for a given user
    },

    address: {
      type: String, // address entered by the user manually.  Not validated by mapquest
      required: [true, 'Please add an address']
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
  
    location: {
      type: {
        type: String,
        enum: ['Point'] // the only value possible is Point
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String, // address validated by mapquest
      city: String,
      stateCode: String
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
  
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Geocode and create location
  
  // For example we send '42 claude-champagne outremont'
  // The return will be an ARRAY even if we only have one address
  // [
  //   {
  //     formattedAddress: '42 Avenue Claude-Champagne, Montreal, QC H2V 2X1, CA',
  //     latitude: 45.51201,
  //     longitude: -73.61092,
  //     country: null,
  //     city: 'Montreal',
  //     stateCode: 'QC',
  //     zipcode: 'H2V 2X1',
  //     streetName: '42 Avenue Claude-Champagne',
  //     streetNumber: null,
  //     countryCode: 'CA',
  //     provider: 'mapquest'
  //   }
  // ]
  
  
  // Add Index for geospatial search
  BookSchema.index({ "location.coordinates": "2dsphere" });
  
  // the 'next' is to call the piece of middleware .pre
  BookSchema.pre('save', async function(next) {
    const locationMapquest = await geocoder.geocode(this.address);
    console.log(locationMapquest);
  
    // fill the document fields with the loc return by the geocoder api
    this.location = {
      type: 'Point',
      coordinates: [locationMapquest[0].longitude, locationMapquest[0].latitude],
      city: locationMapquest[0].city,
      stateCode: locationMapquest[0].stateCode,
      formattedAddress: locationMapquest[0].formattedAddress
    }
  
    // dont save the address type be the user
    this.address = undefined;
    next();
  });
  
const Book = mongoose.model("Book", BookSchema);
export default Book;