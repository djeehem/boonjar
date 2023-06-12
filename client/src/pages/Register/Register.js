import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";
import GeolocationButton from "../../components/GeolocationButton/GeolocationButton";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGeolocation = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
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
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`
        );

        const lat = response.data[0].lat;
        const lng = response.data[0].lon;

        setLatitude(lat);
        setLongitude(lng);

        // Update user object with latitude and longitude
        user.location.coordinates.latitude = lat;
        user.location.coordinates.longitude = lng;

        console.log(response.data[0].lat, response.data[0].lon);

        console.log(latitude, longitude);
        console.log(response.data[0]);
      }

      const auth = await axios.post(
        "http://localhost:8000/api/auth/register",
        user
      );

      const token = auth.data.token;

      localStorage.setItem("token", token);

      // Update the authentication state to true
      login();

      console.log("Registration successful!");

      navigate("/");
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

  // Adding the token to the headers in subsequent requests
  // const fetchData = async () => {
  //   try {
  // const token = localStorage.getItem("token");
  //     const response = await axios.get("http://localhost:8000/api/data", {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  //       },
  //     });
  //     // Handle the response data
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
            required
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
