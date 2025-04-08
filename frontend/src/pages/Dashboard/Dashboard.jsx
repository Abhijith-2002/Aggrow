import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Dashboard.css";
import Header from "./Header";
import ContentSection from "./ContentSection";
import { useTranslation } from "react-i18next";
import { FaLeaf, FaSeedling, FaDiagnoses } from "react-icons/fa";

const Dashboard = () => {
  const { t } = useTranslation();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    // Scroll to the corresponding section based on the route
    if (location.hash === "#about") {
      document
        .getElementById("about-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (location.hash === "#services") {
      document
        .getElementById("services-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]); // Run this effect whenever the route changes

  return (
    <div className="dashboard-app">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-hero">
          <h1 className="dashboard-title">
            Welcome to <span>Aggrow</span>
          </h1>
          <p className="dashboard-subtitle">
            {t("dashboard.welcome.description")}
          </p>
        </div>

        <div className="dashboard-options">
          <Link to="/disease-detection" className="dashboard-card disease-card">
            <FaDiagnoses className="dashboard-icon" />
            <h3>{t("diseaseDetection.title")}</h3>
            <p>{t("diseaseDetection.subtitle2")}</p>
          </Link>

          <Link to="/crop-recommendation" className="dashboard-card crop-card">
            <FaSeedling className="dashboard-icon" />
            <h3>{t("cropRecommendation.title")}</h3>
            <p>{t("cropRecommendation.subtitle2")}</p>
          </Link>

          <Link
            to="/fertilizer-recommendation"
            className="dashboard-card fertilizer-card"
          >
            <FaLeaf className="dashboard-icon" />
            <h3>{t("fertilizerRecommendation.title")}</h3>
            <p>{t("fertilizerRecommendation.subtitle2")}</p>
          </Link>
        </div>
      </main>

      {/* ContentSection remains part of the Dashboard */}
      <ContentSection />
    </div>
  );
};

export default Dashboard;
