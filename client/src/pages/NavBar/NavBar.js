import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { AuthContext } from "../../contexts/authContext";
import BookSearch from "../../components/BookSearch/BookSearch";

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = (e) => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    // Additional logout logic if needed
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link to="/">Home</Link>
        <BookSearch />
        <Link to="/post-book">Post Book</Link>
      </div>
      <div className={styles.navbarRight}>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {isAuthenticated ? (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              onClick={handleDropdownToggle}
            >
              Account
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/settings">Settings</Link>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
