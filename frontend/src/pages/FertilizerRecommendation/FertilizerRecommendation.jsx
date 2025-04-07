import React, { useState } from "react";
import axios from "axios";
import cropList from "./crops.json";
import Header from "../Dashboard/Header";
import "./FertilizerRecommendation.css";
import { useTranslation } from "react-i18next";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaSpinner,
  FaFlask,
  FaSeedling,
  FaBalanceScale,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";

const FertilizerRecommendation = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    crop_type: "",
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    ph: "",
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutofill = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setAutoFillLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `http://localhost:5000/fertilizer/autofill?lat=${latitude}&lon=${longitude}`
          );

          if (res.data) {
            setFormData((prev) => ({
              ...prev,
              nitrogen: res.data.nitrogen || prev.nitrogen,
              phosphorous: res.data.phosphorous || prev.phosphorous,
              potassium: res.data.potassium || prev.potassium,
              ph: res.data.ph || prev.ph,
            }));
          } else {
            setError(res.data?.error || "Failed to autofill soil data");
          }
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch soil data");
          console.error("Autofill Error:", err);
        } finally {
          setAutoFillLoading(false);
        }
      },
      (error) => {
        setError("Unable to retrieve location. Please enable GPS.");
        console.error("Geolocation Error:", error);
        setAutoFillLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.crop_type ||
      !formData.nitrogen ||
      !formData.phosphorous ||
      !formData.potassium ||
      !formData.ph
    ) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/fertilizer/recommend",
        {
          crop_type: formData.crop_type,
          nitrogen: parseFloat(formData.nitrogen),
          phosphorous: parseFloat(formData.phosphorous),
          potassium: parseFloat(formData.potassium),
          ph: parseFloat(formData.ph),
        }
      );
      if (response.data) {
        setRecommendation(response.data);
      } else {
        throw new Error(response.data?.error || "Failed to get recommendation");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || error.message || "Recommendation failed"
      );
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseRecommendation = (data) => {
    if (!data) return [];
    console.log("Parsed recommendation data:", data.organic_fertilizer);

    let result = data.organic_fertilizer;
    result = result.split("\n").filter((line) => line.trim() !== "");
    console.log("Parsed recommendation bla:", result);

    // Define the sections dynamically
    const sections = [
      {
        title: t("fertilizerRecommendation.recommendation.Analysis"),
        icon: <FaBalanceScale />,
        contentGenerator: (key) =>
          t(`fertilizerRecommendation.recommendation.${key}.title`) ||
          "No specific recommendation",
      },
      {
        title: t("fertilizerRecommendation.recommendation.Fertilizer"),
        icon: <FaFlask />,
        contentGenerator: (key) => {
          const typeObject = t(
            `fertilizerRecommendation.recommendation.${key}.Type`,
            { returnObjects: true }
          );
          const length = Object.keys(typeObject || {}).length; // Get the length of the JSON object
          const randomIndex = Math.floor(Math.random() * length) + 1; // Generate a random number based on the length
          return (
            t(
              `fertilizerRecommendation.recommendation.${key}.Type.${randomIndex}`
            ) || "No specific recommendation"
          );
        },
      },
      {
        title: t("fertilizerRecommendation.recommendation.Organic"),
        icon: <FaLeaf />,
        contentGenerator: (key) => {
          const organicObject = t(
            `fertilizerRecommendation.recommendation.${key}.result.organicTreatment`,
            { returnObjects: true }
          );
          const length = Object.keys(organicObject || {}).length; // Get the length of the JSON object
          const randomIndex = Math.floor(Math.random() * length) + 1; // Generate a random number based on the length
          return (
            t(
              `fertilizerRecommendation.recommendation.${key}.result.organicTreatment.${randomIndex}`
            ) || "No specific recommendation"
          );
        },
      },
      {
        title: t("fertilizerRecommendation.recommendation.Inorganic"),
        icon: <FaFlask />,
        contentGenerator: (key) => {
          const inorganicObject = t(
            `fertilizerRecommendation.recommendation.${key}.result.inorganicTreatment`,
            { returnObjects: true }
          );
          const length = Object.keys(inorganicObject || {}).length; // Get the length of the JSON object
          const randomIndex = Math.floor(Math.random() * length) + 1; // Generate a random number based on the length
          return (
            t(
              `fertilizerRecommendation.recommendation.${key}.result.inorganicTreatment.${randomIndex}`
            ) || "No specific recommendation"
          );
        },
      },
    ];

    // Generate sections dynamically
    return sections.map((section) => ({
      title: section.title,
      icon: section.icon,
      content: result.map((key) => section.contentGenerator(key)),
    }));
  };

  const recommendationSections = recommendation
    ? parseRecommendation(recommendation)
    : [];

  return (
    <div className="fertilizer-recommendation-page">
      <Header />
      <div className="fertilizer-container">
        <h2>
          <FaLeaf /> {t("fertilizerRecommendation.title")}
        </h2>
        <p className="subtitle">{t("fertilizerRecommendation.description")}</p>

        <div className="autofill-container">
          <button
            className="autofill-btn"
            onClick={handleAutofill}
            disabled={autoFillLoading}
          >
            {autoFillLoading ? (
              <>
                <FaSpinner className="spinner-icon" />{" "}
                {t("fertilizerRecommendation.loading")}
              </>
            ) : (
              <>
                <FaMapMarkerAlt /> {t("fertilizerRecommendation.autofill")}
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="fertilizer-form">
          <div className="form-group">
            <label htmlFor="crop_type">
              <FaSeedling /> {t("fertilizerRecommendation.form.cropType")}
            </label>
            <select
              id="crop_type"
              name="crop_type"
              onChange={handleChange}
              value={formData.crop_type}
              required
            >
              <option value="">
                {t("fertilizerRecommendation.form.selectCrop")}
              </option>
              {cropList.map((crop, index) => (
                <option key={index} value={crop}>
                  {t(`crops.${crop.toLowerCase()}`) || crop}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nitrogen">
              <FaFlask /> {t("fertilizerRecommendation.form.nitrogen")}
            </label>
            <input
              type="number"
              id="nitrogen"
              name="nitrogen"
              min="0"
              step="1"
              placeholder="40"
              onChange={handleChange}
              required
              value={formData.nitrogen}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phosphorous">
              <FaFlask /> {t("fertilizerRecommendation.form.phosphorous")}
            </label>
            <input
              type="number"
              id="phosphorous"
              name="phosphorous"
              min="0"
              step="1"
              placeholder="125"
              onChange={handleChange}
              required
              value={formData.phosphorous}
            />
          </div>

          <div className="form-group">
            <label htmlFor="potassium">
              <FaFlask /> {t("fertilizerRecommendation.form.pottasium")}
            </label>
            <input
              type="number"
              id="potassium"
              name="potassium"
              min="0"
              step="1"
              placeholder="50"
              onChange={handleChange}
              required
              value={formData.potassium}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ph">
              <FaBalanceScale /> {t("fertilizerRecommendation.form.phLevel")}
            </label>
            <input
              type="number"
              id="ph"
              name="ph"
              min="0"
              max="14"
              step="0.1"
              placeholder="6.5"
              onChange={handleChange}
              required
              value={formData.ph}
            />
          </div>

          <button type="submit" className="predict-btn" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner-icon" />{" "}
                {t("fertilizerRecommendation.recommending")}
              </>
            ) : (
              <>
                <FaCheck /> {t("fertilizerRecommendation.recommend")}
              </>
            )}
          </button>
        </form>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t("Analyzing soil data...")}</p>
          </div>
        )}

        {recommendationSections.length > 0 && (
          <div className="recommendation-box">
            <h3>
              <FaLeaf /> {t("fertilizerRecommendation.result")}
            </h3>

            {recommendationSections.map((section, index) => (
              <div key={index} className="recommendation-section">
                <div
                  className="section-header"
                  onClick={() => toggleSection(index)}
                >
                  <h4>
                    {section.icon} {section.title}
                  </h4>
                  {expandedSections[index] ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>

                {expandedSections[index] && (
                  <ul>
                    {section.content.map((line, i) => (
                      <li key={i}>
                        <FaLeaf className="bullet-icon" /> {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FertilizerRecommendation;
