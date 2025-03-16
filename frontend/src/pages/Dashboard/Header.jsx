import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import i18n hook
import "./Header.css";
import logo from "../../assets/aggrow-logo.png";

const Header = () => {
  const { t, i18n } = useTranslation(); // Translation hook

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Aggrow Logo" className="logo" />
      </div>

      <nav className="navigation">
        <a href="/" className="navimp-link">
          {t("header.home")}
        </a>
        <a href="/about" className="nav-link">
          {t("header.about")}
        </a>

        <div className="dropdown-container">
          <button className="dropdown-button" onClick={toggleDropdown}>
            {t("header.services")}
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
              {t("navigation.diseaseDetection")}
            </a>
            <a href="/crop-recommendation" className="dropdown-item">
              {t("navigation.cropRecommendation")}
            </a>
            <a href="/fertilizer-recommendation" className="dropdown-item">
              {t("navigation.fertilizerRecommendation")}
            </a>
          </div>
        </div>

        {/* Language Selector */}
        <div className="language-selector">
          <label>{t("common.selectLanguage") || "Select Language"}:</label>
          <select onChange={(e) => changeLanguage(e.target.value)} value={language}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ml">മലയാളം</option>
          </select>
        </div>
      </nav>
    </header>
  );
};

export default Header;