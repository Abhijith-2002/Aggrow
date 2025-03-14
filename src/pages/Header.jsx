import React, { useState } from "react";
import "../styles/Header.css";
import logo from "../assets/aggrow-logo.png";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Aggrow Logo" className="logo" />
      </div>

      <nav className="navigation">
        <a href="/" className="navimp-link">
          Home
        </a>
        <a href="/about" className="nav-link">
          About
        </a>

        <div className="dropdown-container">
          <button className="dropdown-button" onClick={toggleDropdown}>
            Services
            <svg
              className="dropdown-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
            <a href="/disease-detection" className="dropdown-item">
              Disease Detection
            </a>
            <a href="/crop-recommendation" className="dropdown-item">
              Crop Recommendation
            </a>
            <a href="/fertilizer-recommendation" className="dropdown-item">
              Fertilizer Recommendation
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
