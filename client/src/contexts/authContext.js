import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import LoadingPage from "../pages/Loading/LoadingPage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log(isAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");

    if (accessToken) {
      axios
        .post(
          "http://localhost:8000/api/auth/verify-token",
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsAuthenticated(true);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error verifying JWT:", error);
          if (refreshToken) {
            axios
              .post("http://localhost:8000/api/auth/refresh-token", {
                refreshToken,
              })
              .then((response) => {
                const newAccessToken = response.data.accessToken;
                localStorage.setItem("access-token", newAccessToken);
                setIsLoading(false);
                setIsAuthenticated(true);
              })
              .catch((error) => {
                console.error("Error refreshing token:", error);
                setIsLoading(false);
                localStorage.removeItem("access-token");
                localStorage.removeItem("refresh-token");
                navigate("/login");
              });
          } else {
            setIsLoading(false);
          }
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    // localStorage.setItem("access-token", accessToken);
    // localStorage.setItem("refresh-token", refreshToken);
    navigate("/");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    navigate("/");
  };

  const authContextValue = {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
  };

  return isLoading ? (
    <LoadingPage />
  ) : (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
