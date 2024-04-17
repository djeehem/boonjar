import React, { useState, useContext } from "react";
import axios from '../../api/axios';

import { AuthContext } from "../../contexts/authContext";
import { registerUserApi } from "../../services/authService";
import GeolocationButton from "../../components/GeolocationButton/GeolocationButton";

const Register = () => {
  console.log("Register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState(false);  // track whether the postal code input has an error.
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { login } = useContext(AuthContext);

  const handleGeolocation = async (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    
    // get the postal code from the coordinates
    const postalCode = await getPostalCodeFromCoordinates(lat, lng);

    // Update the postal code in the state if it's not empty
    if (postalCode) {
      setPostalCode(postalCode);
    }
  };

  const getPostalCodeFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get('/get-postalCode', {
          params: {
              latitude: latitude,
              longitude: longitude,
          },
      });

      // Extract the postal code value from the object in one line
      let { postalCode } = response.data;

      // remove the space
      postalCode = postalCode.replace(/\s/g, '');
      
      return postalCode;

    } catch (error) {
      console.error('Error getting postal code from server:', error);

      return null;
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPostalCode("");
    setLatitude(null);
    setLongitude(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO_COM: Mimi -> si on a pas de Postal Code comment tu fais pour afficher "Please Fill out this field"

    // postal code and Lat/long are validated
    const user = {
      email,
      password,
      location: {
        postalCode,
        coordinates: {
          latitude,
          longitude,
        },
      },
    };

    try {
      // verify postalCode
      if (postalCode) {
        if(!isValidPostalCode(postalCode)){
          setPostalCodeError(true);
          return;
        }

        // get the lat/long from Mapquest
        const latLng = await getCoordinatesFromPostalCode(postalCode);

        if(!latLng){
          setPostalCodeError(true);
          return;
        }

        // lat/long are good
        setLatitude(latLng.lat);
        setLongitude(latLng.lng);

        // Update user object with latitude and longitude
        user.location.coordinates.latitude = latLng.lat;
        user.location.coordinates.longitude = latLng.lng;

        // Save the valid postal code to Local Storage 
        localStorage.setItem('postalCode', postalCode);
        setPostalCodeError(false);
      }

      registerUserApi(user);
      login();
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // TODO_COM mettre en commun car utiliser dans Home.js
  const handlePostalCodeChange = (e) => {
    // Remove any characters that are not letters or numbers
    const newPostalCode  = e.target.value.replace(/[^A-Za-z0-9]/g, ''); 
    setPostalCode(newPostalCode.toUpperCase()); // Convert to uppercase
    setPostalCodeError(false); // Reset postalCodeError when the value changes
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code:</label>
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
          <p>or</p>
          <GeolocationButton onGeolocation={handleGeolocation} />
        </div>
        <button type="submit">Register</button>
      </form>
      <div>
        <h3>Or sign up with:</h3>
        <div>
          <a href="/auth/google">Google</a>
          <a href="/auth/facebook">Facebook</a>
          <a href="/auth/twitter">Twitter</a>
          <a href="/auth/apple">Apple</a>
          <a href="/auth/linkedin">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
