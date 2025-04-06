import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Header.css";
import logo from "../../assets/aggrow-logo.png";
import {
  FaHome,
  FaInfoCircle,
  FaLeaf,
  FaChevronDown,
  FaChevronUp,
  FaGlobe
} from "react-icons/fa";
import { MdAgriculture } from "react-icons/md";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Aggrow Logo" className="logo" />
        <span className="logo-text">Aggrow</span>
      </div>

      <nav className="navigation">
        <a href="/" className="nav-link">
          <FaHome className="nav-icon" />
          {t("header.home")}
        </a>
        <a href="/about" className="nav-link">
          <FaInfoCircle className="nav-icon" />
          {t("header.about")}
        </a>

        <div className={`dropdown-container ${dropdownOpen ? "active" : ""}`}>
          <button className="dropdown-button" onClick={toggleDropdown}>
            <MdAgriculture className="nav-icon" />
            {t("header.services")}
            {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <div className="dropdown-menu">
            <a href="/disease-detection" className="dropdown-item">
              <FaLeaf className="dropdown-icon" />
              {t("navigation.diseaseDetection")}
            </a>
            <a href="/crop-recommendation" className="dropdown-item">
              <FaLeaf className="dropdown-icon" />
              {t("navigation.cropRecommendation")}
            </a>
            <a href="/fertilizer-recommendation" className="dropdown-item">
              <FaLeaf className="dropdown-icon" />
              {t("navigation.fertilizerRecommendation")}
            </a>
          </div>
        </div>

        <div className="language-selector">
          <FaGlobe className="language-icon" />
          <select 
            onChange={(e) => changeLanguage(e.target.value)} 
            value={language}
            className="language-select"
          >
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