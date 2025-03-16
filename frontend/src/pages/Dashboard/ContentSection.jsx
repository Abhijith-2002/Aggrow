import React from "react";
import "./ContentSection.css";
import { useTranslation } from "react-i18next";

const ContentSection = () => {
  const { t } = useTranslation();
  return (
    <div className="content-section">
      <div className="about-section">
        <h2>{t("dashboard.about.title")}</h2>
        <p>
          {t("dashboard.about.description1")}
        </p>
        <p>
          {t("dashboard.about.description2")}
        </p>
        <p>
          {t("dashboard.about.description3")}
        </p>
      </div>

      <div className="services-section">
        <h2>{t("dashboard.services.title")}</h2>
        <div className="service-card">
          <h3>{t("dashboard.services.diseaseDetection.title")}</h3>
          <p>
            {t("dashboard.services.diseaseDetection.description")}
          </p>
        </div>

        <div className="service-card">
          <h3>{t("dashboard.services.cropRecommendation.title")}</h3>
          <p>
            {t("dashboard.services.cropRecommendation.description")}
          </p>
        </div>

        <div className="service-card">
          <h3>{t("dashboard.services.fertilizerRecommendation.title")}</h3>
          <p>
            {t("dashboard.services.fertilizerRecommendation.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;