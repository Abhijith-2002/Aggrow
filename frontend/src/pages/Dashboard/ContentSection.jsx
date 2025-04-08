import React from "react";
import "./ContentSection.css";
import { useTranslation } from "react-i18next";
import {
  FaLeaf,
  FaSeedling,
  FaDiagnoses,
  FaChartLine,
  FaRecycle,
} from "react-icons/fa";

const ContentSection = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      {/* Content Sections */}
      <div className="content-section">
        {/* About Section */}
        <div id="about-section" className="about-section">
          <div className="about-content">
            <h2>
              <FaLeaf className="section-icon" />
              {t("dashboard.about.title")}
            </h2>
            <div className="about-text">
              <p className="about-paragraph">
                {t("dashboard.about.description1")}
              </p>
              <p className="about-paragraph">
                {t("dashboard.about.description2")}
              </p>
              <p className="about-paragraph">
                {t("dashboard.about.description3")}
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services-section" className="services-section">
          <h2>
            <FaChartLine className="section-icon" />
            {t("dashboard.services.title")}
          </h2>

          <div className="services-grid">
            <div className="service-card disease-card">
              <FaDiagnoses className="service-icon" />
              <div className="service-content">
                <h3>{t("dashboard.services.diseaseDetection.title")}</h3>
                <p>{t("dashboard.services.diseaseDetection.description")}</p>
              </div>
            </div>

            <div className="service-card crop-card">
              <FaSeedling className="service-icon" />
              <div className="service-content">
                <h3>{t("dashboard.services.cropRecommendation.title")}</h3>
                <p>{t("dashboard.services.cropRecommendation.description")}</p>
              </div>
            </div>

            <div className="service-card fertilizer-card">
              <FaRecycle className="service-icon" />
              <div className="service-content">
                <h3>
                  {t("dashboard.services.fertilizerRecommendation.title")}
                </h3>
                <p>
                  {t("dashboard.services.fertilizerRecommendation.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
