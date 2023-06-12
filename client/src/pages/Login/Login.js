import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the server
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Handle successful login
      const { token } = response.data;
      // Save the token to local storage or session storage
      document.cookie = `token=${token}; path=/`;
      // Redirect or perform any other actions after successful login
      navigate("/");
    } catch (error) {
      // Handle login error
      console.error(error);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      // Send social login request to the server
      const response = await axios.get(
        `http://localhost:8000/api/auth/${provider}`
      );

      // Handle successful login
      const { token } = response.data;
      // Save the token to local storage or session storage
      document.cookie = `token=${token}; path=/`;
      // Redirect or perform any other actions after successful login
      navigate("/");
    } catch (error) {
      // Handle social login error
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <button type="submit">Login</button>
      </form>
      <div>
        <p>Or login with:</p>
        <div>
          <button onClick={() => handleSocialLogin("google")}>
            Login with Google
          </button>
          <button onClick={() => handleSocialLogin("facebook")}>
            Login with Facebook
          </button>
          <button onClick={() => handleSocialLogin("twitter")}>
            Login with Twitter
          </button>
          <button onClick={() => handleSocialLogin("apple")}>
            Login with Apple
          </button>
          <button onClick={() => handleSocialLogin("linkedin")}>
            Login with LinkedIn
          </button>
        </div>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
