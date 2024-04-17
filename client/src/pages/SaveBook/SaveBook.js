// TODO_COM this page is to test the save book after getting info from a ISBN.
// This is to bypass the login

import React, { useState } from "react";
import axios from '../../api/axios';

const SaveBook = () => {
  const [userId, setUserId] = useState("");
  const [isbn, setISBN] = useState("");
  const [bookData, setBookData] = useState(null);
  const [editedBook, setEditedBook] = useState({
    title: "",
    author: "",
    publisher: "",
    description: "",
    pageCount: 0,
    condition: "", // Updated to an empty string
    price: 0,
    postalCode: "",
    // Add other properties you want to display and edit
  });
  const [isbnError, setISBNError] = useState("");
  const [photoError, setPhotoError] = useState('');
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [pictures, setPictures] = useState([]);
  
  const handleSearch = async () => {
    try {
      setPhotoError(''); // Clear any previous error

      const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
      const response = await axios.get(url);
      console.log(url);

      const book = response.data.items?.[0]?.volumeInfo;

      if (book) {
        setBookData(book);
        setEditedBook({
          title: book.title || "",
          author: book.authors ? book.authors.join(", ") : "",
          publisher: book.publisher || "",
          description: book.description || "",
          pageCount: book.pageCount || 0,
          condition: "", // Reset condition to an empty string
          price: 0,
        });

        // Retrieve postal code from local storage
        const storedPostalCode = localStorage.getItem("postalCode");
        if (storedPostalCode) {
          setPostalCode(storedPostalCode);
        }

        // Clear error message and remove red color
        setISBNError("");
      } else {
        // Set error message, make the textbox red, and clear book properties
        setISBNError("Invalid ISBN");
        setEditedBook({
          title: "",
          author: "",
          publisher: "",
          description: "",
          pageCount: 0,
          condition: "", // Reset condition to an empty string
          price: 0,
          // Reset other properties
        });
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const handleInputChange = async (e, property) => {
    const inputValue = e.target.value;
    setEditedBook({ ...editedBook, [property]: inputValue });
  };
  
  const handlePhotoChange = (e) => {
    const files = e.target.files;
    const photoUrls = [];
    const selectedImages = Array.from(files); // Create an array of selected images

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split('/')[1]; // Extract the file extension
        //console.log("****** file -> ", file);

        // Validate file type
        if (['jpeg', 'jpg', 'gif', 'png'].includes(fileType)) {
            const reader = new FileReader();

            reader.onload = (event) => {
                photoUrls.push(event.target.result);

                if (photoUrls.length === files.length) {
                    setEditedBook({ ...editedBook, photos: photoUrls });
                    setPhotoError(''); // Clear any previous error
                }
            };

            reader.readAsDataURL(file);

            // Update the pictures state with selected images
            setPictures(selectedImages);
        } else {
            setPhotoError('Only JPEG, JPG, GIF, and PNG files are allowed.');
            // Clear any previously selected files
            e.target.value = null;
            return; // Exit the function early
        }
    }
  };


  const displaySelectedPhotos = () => {
    document.querySelector('input[type="file"]').click();
  }

  const handleRemovePhoto = (index) => {
     // Create a copy of the pictures array
     const updatedPictures = [...pictures];
     // Remove the photo at the specified index
     updatedPictures.splice(index, 1);
 
     // Create a copy of the editedBook object
     const updatedBook = { ...editedBook };
     // Remove the photo at the specified index
     updatedBook.photos.splice(index, 1);
 
     // Set the state using setPictures and setEditedBook
     setPictures(updatedPictures);
     setEditedBook(updatedBook);
  };

  // TODO_COM mettre en commun car utiliser dans Register.js et Home.js
  const handlePostalCodeChange = (e) => {
    // Remove any characters that are not letters or numbers
    const newPostalCode  = e.target.value.replace(/[^A-Za-z0-9]/g, '');
    setPostalCode(newPostalCode.toUpperCase()); // Convert to uppercase
    setPostalCodeError(false); // Reset postalCodeError when the value changes
  };
  
  const handleSave = async () => {
    try {
      // Check if required fields are filled
      const missingFields = [];
      
      if (!editedBook.title) missingFields.push("Title");
      if (!editedBook.author) missingFields.push("Author");
      if (!editedBook.condition) missingFields.push("Condition");
      if (!editedBook.price) missingFields.push("Price");
      if (!postalCode || !isValidPostalCode(postalCode)) missingFields.push("Postal Code");

      // If there are missing fields, display alert message
      if (missingFields.length > 0) {
        const missingFieldsMessage = missingFields.join(", ");
        alert(`Please fill in all required fields (${missingFieldsMessage}) before saving.`);
        return;
      }
      else{
        if(editedBook.price < 0){
          alert("Price cannot be less then 0$");
          return;
        }
      }

      // if there is no postalCode dont save
      if (!postalCode || !isValidPostalCode(postalCode)) {
        setPostalCodeError(true);
        return;
      }

      // get the lat/long from Mapquest
      const coords = await getCoordinatesFromPostalCode(postalCode);
      if(!coords){
       setPostalCodeError(true);
       return;
      }

      // FormData Prepare the book data to be sent to the server using FormData to send the photos to the server
      const formData = new FormData();
      formData.append("user", userId);
      formData.append("postalCode", postalCode);
      formData.append("condition", editedBook.condition);
      formData.append("price", editedBook.price);
      formData.append("location[type]", "Point");
      formData.append("location[coordinates][]", coords.lng);
      formData.append("location[coordinates][]", coords.lat);
      formData.append("volumeInfo[title]", editedBook.title);
      formData.append("volumeInfo[authors][]", editedBook.author);
      formData.append("volumeInfo[publisher]", editedBook.publisher);
      formData.append("volumeInfo[description]", editedBook.description);
      formData.append("volumeInfo[pageCount]", editedBook.pageCount);
      
      //Add all photos
      pictures.forEach((image, index) => {
        formData.append(`myPhotos`, image);   // "myPhotos" must match with <input type="file" name="myPhotos"
        console.log("adding file: ", `myPhotos[${index}]`);
      });

      // Make a POST request to save the book data
      const response = await axios.post(
        "http://localhost:8000/api/books",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle the response
      if (response.status === 201) {
        alert(`${editedBook.title} saved successfully!`);
        window.location.reload(); // Refresh the page after the user clicks "OK" on the alert
      } else {
        console.error("Error saving book. Status:", response.status);
      }
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  // TODO_COM deplacer dans endroit commun.  Aussi dans Home.js SaveBook.js
  const isValidPostalCode = (postalCode) => {
    
    // Remove spaces and convert to uppercase
    postalCode = postalCode.replace(/\s+/g, '').toUpperCase(); 
    
    // Canadian postal code format: A1A1A1
    const postalCodePattern = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    
    return postalCodePattern.test(postalCode);
  };

  // TODO_COM mettre en commun car utiliser dans Home.js
  const getCoordinatesFromPostalCode = async (postalCode) => {
    try {
      const response = await axios.get('/getMapquestCoordinates', {
          params: {
              postalCode: postalCode,
          },
      });
      const latLng = response.data;

      return latLng;

    } catch (error) {
      console.error('Error getting lat/long from server:', error);

      return null;
    }
  };
  
  return (
    <div>
      <label>User Id: </label>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <br />
      <label>ISBN: </label>
      <input
        type="text"
        value={isbn}
        onChange={(e) => setISBN(e.target.value)}
        style={{ borderColor: isbnError ? "red" : "" }}
      />
      <button onClick={handleSearch}>Search</button>

      {isbnError && <p style={{ color: "red" }}>{isbnError}</p>}

      {bookData && (
        <div>
          <h2>Book Details</h2>
          <label>**Title: </label>
          <input
            type="text"
            value={editedBook.title}
            onChange={(e) => handleInputChange(e, "title")}
          />
          <br />
          <label>**Author: </label>
          <input
            type="text"
            value={editedBook.author}
            onChange={(e) => handleInputChange(e, "author")}
          />
          <br />
          <label>Publisher: </label>
          <input
            type="text"
            value={editedBook.publisher}
            onChange={(e) => handleInputChange(e, "publisher")}
          />
          <br />
          <label>Description: </label>
          <textarea
            value={editedBook.description}
            onChange={(e) => handleInputChange(e, "description")}
            style={{ height: "100px", width: "300px" }} // Increase textarea height and width
          />
          <br />
          <label>Page Count: </label>
          <input
            type="number"
            value={editedBook.pageCount}
            onChange={(e) => handleInputChange(e, "pageCount")}
          />
          <br />
          <h3>Sale Details</h3>
          <label>**Condition: </label>
          <select
            value={editedBook.condition}
            onChange={(e) => handleInputChange(e, "condition")}
          >
            <option value="">Select Condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="ok">OK</option>
            <option value="poor">Poor</option>
          </select>
          <br />
          <label>**Price: </label>
          <input
            type="number"
            value={editedBook.price}
            onChange={(e) => handleInputChange(e, "price")}
          />
          <br />
          <label>Photos: </label>
          <input
              type="file"
              name="myPhotos"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoChange(e)}
              style={{ display: "none" }} // Hide the default file input
          />
          <button onClick={displaySelectedPhotos}>
            Choose Files
          </button>
          {editedBook.photos && editedBook.photos.length > 0 && (
              <div>
                  <h4>Uploaded Photos:</h4>
                  {editedBook.photos.map((photo, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={photo} alt={`Book pics ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
                      <button onClick={() => handleRemovePhoto(index)}>Remove</button>
                  </div>
                  ))}
              </div>
          )}
          {photoError && <p style={{ color: 'red' }}>{photoError}</p>}
          <h3>**Postal Code</h3>
          <input
            type="postalCode"
            id="postalCode"
            value={postalCode}
            onChange={handlePostalCodeChange}
            required
            placeholder="A1A1A1"
            style={postalCodeError ? { borderColor: 'red' } : {}}
          />
          {postalCodeError && <p style={{ color: 'red' }}>Please enter a valid postal code</p>}

          <div>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveBook;
