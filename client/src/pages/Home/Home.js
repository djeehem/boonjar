import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './SearchBox.css';

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // When the value of the textbox change, set it in the variable searchTerm
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeError, setPostalCodeError] = useState(false);  // track whether the postal code input has an error.
  const [selectedDistance, setSelectedDistance] = useState(''); // State for selected distance


  useEffect(() => {
    // retrieve the postal code from the local storage
    const savedPostalCode = localStorage.getItem('postalCode');
    if (savedPostalCode) {
      setPostalCode(savedPostalCode);
    }

    const savedSelectedDistance = localStorage.getItem('distanceSearch');
    if(savedSelectedDistance){
      setSelectedDistance(savedSelectedDistance);
    }
  }, []);

  const handleDistanceChange = (e) => {
    setSelectedDistance(e.target.value);
  };

  const isValidPostalCode = (postalCode) => {
    
    // Remove spaces and convert to uppercase
    postalCode = postalCode.replace(/\s+/g, '').toUpperCase(); 
    
    // Canadian postal code format: A1A1A1
    const postalCodePattern = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    
    return postalCodePattern.test(postalCode);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchBooks();
    }
  };

  const handlePostalCodeChange = (e) => {
    // Remove any characters that are not letters or numbers
    const newPostalCode  = e.target.value.replace(/[^A-Za-z0-9]/g, ''); 
    setPostalCode(newPostalCode.toUpperCase()); // Convert to uppercase
    setPostalCodeError(false); // Reset postalCodeError when the value changes
  };

  const searchBooks = async () => {
    try {
      // Clear previous search results
      setSearchResults(null);

      // if there is no postalCode dont search
      if (!postalCode || !isValidPostalCode(postalCode)) {
        setPostalCodeError(true);
        return;
      }

       // get the lat/long from Mapquest
       const latLng = await getLatLongForPostalCode(postalCode);
       if(!latLng){
        setPostalCodeError(true);
        return;
       }

       setPostalCodeError(false);
       
       // Save the valid postal code to Local Storage 
       localStorage.setItem('postalCode', postalCode);
       localStorage.setItem('distanceSearch', selectedDistance);
       
        // Send search request to the server
        const response = await axios.get('/api/books/near', {
          params: {
            latitude: latLng.lat,
            longitude: latLng.lng,
            maxDistance: selectedDistance * 1000 // convert in meters
          }
    });

    // Handle successful response from the server
    console.log('Search results received!');
    console.log('Search results:', response.data);

    // Set search results in the state
    setSearchResults(response.data);
    } catch (error) {
      console.error('Error sending search request:', error);
    }
  };

  const getLatLongForPostalCode = async (postalCode) => {
    try {
      const response = await axios.get('/get-lat-long', {
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
      <p>Home</p>
      <div className="search-books">
        <div className="postal-code-input">
          <div className="postal-code-label">Postal Code</div>
          <input
            type="text"
            value={postalCode}
            placeholder="Postal Code"
            onChange={handlePostalCodeChange}
            style={postalCodeError ? { borderColor: 'red' } : {}}
          />
        </div>
        <div className="distance-label">
          <label>Distance</label>
          <select value={selectedDistance} onChange={handleDistanceChange}>
            <option value="2">2 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </select>
        </div>
        <div className="search-input">
          <div className="my-search-label">My Search</div>
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              placeholder="Title, authors..."
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown} 
            />
            <button className="search-icon" onClick={searchBooks}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
  
      {/* if Search is clicked and the postal code is empty, postalCodeError is set to true */}
      {postalCodeError && <p style={{ color: 'red' }}>Please enter a valid postal code</p>}
  
      {/* Display data count from search results */}
      {searchResults && (
        <p>Data Count: {searchResults.count}</p>
      )}
  
      {/* Display search results */}
      {searchResults && (
        <div id="search-results">
          <p>Search Results:</p>
          {/* Display each book data */}
          {searchResults.data.map((book, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                   {book.volumeInfo.title}
                </p>
                <p>Author: {book.volumeInfo.authors.join(', ')}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p>Price: ${book.price.toFixed(2)}</p>
              </div>
            </div>
            <p>Address: {book.location.formattedAddress}</p>
            {/* Display other book data here */}
            {book.volumeInfo.imageLinks ? (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt=""
                style={{ width: '128px', height: '192px' }}
              />
              ) : (
                <img
                  src={`${process.env.PUBLIC_URL}/No-Cover-Image.png`}
                  alt=""
                  style={{ width: '128px', height: '192px' }}
                />
              )}
              <p>
                Amazon Link:{' '}
                <a
                  href={book.amazonLink || 'https://www.amazon.ca/books-used-books-textbooks/b?ie=UTF8&node=916520'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.amazonLink || 'https://www.amazon.ca/books-used-books-textbooks/b?ie=UTF8&node=916520'}
                </a>
              </p>
              <p>Distance: {book.distance.toFixed(2)} km</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
