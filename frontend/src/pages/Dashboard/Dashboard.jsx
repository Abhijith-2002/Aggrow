import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Header from "./Header";
import ContentSection from "./ContentSection";
import { useTranslation } from "react-i18next";
import { FaLeaf, FaSeedling, FaDiagnoses } from "react-icons/fa";

const Dashboard = () => {
  const { t } = useTranslation();
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

      <ContentSection />
    </div>
  );
};

export default Dashboard;
