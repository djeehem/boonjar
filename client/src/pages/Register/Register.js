import React, { useState, useContext } from "react";

import { AuthContext } from "../../contexts/authContext";
import { getCoordinatesApi } from "../../services/apiService";
import { registerUserApi } from "../../services/authService";
import GeolocationButton from "../../components/GeolocationButton/GeolocationButton";

const Register = () => {
  console.log("Register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { login } = useContext(AuthContext);

  const handleGeolocation = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setAddress("");
    setLatitude(null);
    setLongitude(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
      location: {
        address,
        coordinates: {
          latitude,
          longitude,
        },
      },
    };

    try {
      if (!latitude && !longitude) {
        const { latitude: lat, longitude: lng } = await getCoordinatesApi(
          address
        );

        setLatitude(lat);
        setLongitude(lng);

        // Update user object with latitude and longitude
        user.location.coordinates.latitude = lat;
        user.location.coordinates.longitude = lng;
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

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
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
          <label htmlFor="address">Address:</label>
          <input
            type="address"
            id="address"
            value={address}
            onChange={handleAddressChange}
            // required
          />
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
