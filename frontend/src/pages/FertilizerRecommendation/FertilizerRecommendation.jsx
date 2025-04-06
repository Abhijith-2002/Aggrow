import React, { useState } from "react";
import axios from "axios";
import cropList from "./crops.json";
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

    return [
      {
        title: "Recommended Fertilizer",
        icon: <FaFlask />,
        content: result.map((key) => {
          // Generate a random number between 1 and 5 (adjust range based on your data)
          const randomIndex = Math.floor(Math.random() * 5) + 1;
          return (
            t(
              `fertilizerRecommendation.FertilizerTypes.${key}.${randomIndex}`
            ) || "No specific recommendation"
          );
        }),
      },
      {
        title: "Organic Treatment",
        icon: <FaLeaf />,
        content: Array.isArray(data.organic)
          ? data.organic
          : typeof data.organic === "string"
          ? [data.organic]
          : ["No organic recommendations available"],
      },
      {
        title: "Chemical Treatment",
        icon: <FaFlask />,
        content: Array.isArray(data.chemical)
          ? data.chemical
          : typeof data.chemical === "string"
          ? [data.chemical]
          : ["No chemical recommendations available"],
      },
      {
        title: "Nutrient Analysis",
        icon: <FaBalanceScale />,
        content: Array.isArray(data.analysis)
          ? data.analysis
          : typeof data.analysis === "string"
          ? [data.analysis]
          : ["No nutrient analysis available"],
      },
    ];
  };

  const recommendationSections = recommendation
    ? parseRecommendation(recommendation)
    : [];

  return (
    <div className="fertilizer-container">
      <h2>
        <FaLeaf /> {t("Fertilizer Recommendation")}
      </h2>
      <p className="subtitle">
        {t(
          "Enter soil parameters and crop type for customized recommendations"
        )}
      </p>

      <div className="autofill-container">
        <button
          className="autofill-btn"
          onClick={handleAutofill}
          disabled={autoFillLoading}
        >
          {autoFillLoading ? (
            <>
              <FaSpinner className="spinner-icon" /> {t("Fetching...")}
            </>
          ) : (
            <>
              <FaMapMarkerAlt /> {t("Autofill Soil Data")}
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
            <FaSeedling /> {t("Crop Type")}
          </label>
          <select
            id="crop_type"
            name="crop_type"
            onChange={handleChange}
            value={formData.crop_type}
            required
          >
            <option value="">{t("Select a crop")}</option>
            {cropList.map((crop, index) => (
              <option key={index} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nitrogen">
            <FaFlask /> {t("Nitrogen (kg/ha)")}
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
            <FaFlask /> {t("Phosphorous (kg/ha)")}
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
            <FaFlask /> {t("Potassium (kg/ha)")}
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
            <FaBalanceScale /> {t("Soil pH")}
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
              <FaSpinner className="spinner-icon" /> {t("Processing...")}
            </>
          ) : (
            <>
              <FaCheck /> {t("Get Recommendation")}
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
            <FaLeaf /> {t("Recommendation Results")}
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
                {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
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
  );
};

export default FertilizerRecommendation;
