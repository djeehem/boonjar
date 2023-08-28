import mongoose from "mongoose";
import Book from "../models/Book.js";
import geocoder from "../utils/geocoder.js";

// @desc Create a book for sale
// @route POST http://localhost:8000/api/books/near
const createBook = async (req, res) => {
  console.log(req.body);  // to see what we send to the server in the POST request

  const book = req.body;

  try {
    // await Book.updateMany({}, { $inc: { position: 1 } });

    const newBook = await Book.create(book);

    res.status(201).json({
      status: 201,
      data: newBook,
    });
  } catch (error) {
      console.error(error);
      res.status(409).json({
      status: 409,
      message: error,
    });
  }
};

// @desc get all the books near one user
// @route GET /api/v1/books/near
// in the Json to test for 7 Ainslie:
//{
//   "latitude": "45.51376434339509",
//   "longitude": "-73.61290239095773",
//   "maxDistance": "3500"
// }
const getBooksNearMe = async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance, searchTerm } = req.query;

    let parsedMaxDistance;
    if (typeof maxDistance === 'undefined') {
      parsedMaxDistance = parseInt(process.env.RADIUS_DEFAULT);
      console.log(`Defaut Radius =  ${process.env.RADIUS_DEFAULT}` );
      console.log(`parsedMaxDistance is now =  ${parsedMaxDistance}` );
    } else {
      parsedMaxDistance = parseInt(maxDistance);
    }

    if (isNaN(parsedMaxDistance) || parsedMaxDistance < 0) {
      return res.status(400).json({ error: 'Invalid maxDistance value' });
    }
    const startingPoint = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    // get the books from the db
    const booksAggregation = Book.aggregate([
      {
        $geoNear: {
          near: startingPoint,
          distanceField: "distance",
          spherical: true,
          key: "location.coordinates",
          maxDistance: parsedMaxDistance
        }
      },
      {
        $sort: {
          distance: 1
        }
      }
    ])

    // convert the aggration in array
    let books;

    booksAggregation
      .exec()
      .then((resultBooks) => {
        books = resultBooks;
        
        if (process.env.NODE_ENV === "development") {

          // get the starting point address
          let address;
          geocoder.reverse({ lat: latitude, lon: longitude }, function (err, res) {
            if (err) {
              console.error('Error:', err);
            } else {
              if (res.length > 0) {
                address = res[0].formattedAddress;
              }
              
              console.log(`************ Books within the radius of ${parsedMaxDistance/1000} km ************` );
              
              books.forEach((book) => {
                const distance = calculateDistance(latitude, longitude, book.location.coordinates[1], book.location.coordinates[0]);
                console.log(`${book.title} is at ${distance} km from ${address}`);
              });
            }
          });
        }

        // return the response back to the client by creating a json with the values that we wanted:
          return res.status(200).json({
            success: true,
            count: books.length, 
            data: books
        });
      })    

  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Server error'});
  }
}

// @desc get all the books for one user
// @route GET /api/books/:userid
const getMyBooks = async (req, res) => {
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



// helper for sorting by distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  // Convert coordinates from degrees to radians
  const lat1Rad = degToRad(lat1);
  const lon1Rad = degToRad(lon1);
  const lat2Rad = degToRad(lat2);
  const lon2Rad = degToRad(lon2);

  // Calculate the differences between coordinates
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Apply the Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

// end of helper for sorting




export { createBook, getBooksNearMe, getMyBooks, deleteBook, updateBook, updateBookPositions };
