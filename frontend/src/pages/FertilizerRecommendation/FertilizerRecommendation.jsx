import React, { useState } from "react";
import axios from "axios";
import cropList from "./crops.json"; // 🆕 Import Crop List
import "./FertilizerRecommendation.css";
import { useTranslation } from "react-i18next";

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

  // 📌 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📍 Autofill Data Based on GPS
  const handleAutofill = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setAutoFillLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/fertilizer/autofill?lat=${latitude}&lon=${longitude}`
          );

          if (res.data) {
            setFormData((prev) => ({
              ...prev,
              nitrogen: res.data.nitrogen || prev.nitrogen,
              phosphorous: res.data.phosphorous || prev.phosphorous,
              potassium: res.data.potassium || prev.potassium,
              ph: res.data.ph || prev.ph,
            }));
          }
        } catch (err) {
          alert("❌ Failed to autofill soil data.");
          console.error("Autofill Error:", err);
        } finally {
          setAutoFillLoading(false);
        }
      },
      (error) => {
        alert("❌ Unable to retrieve location. Please enable GPS.");
        console.error("Geolocation Error:", error);
        setAutoFillLoading(false);
      }
    );
  };

  // 📌 Submit & Get Fertilizer Recommendation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/fertilizer/recommend",
        formData
      );
      setRecommendation(response.data);
    } catch (error) {
      alert("❌ Error fetching recommendation.");
      console.error("Recommendation Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fertilizer-container">
      <h2>{t("fertilizerRecommendation.title")}</h2>

      {/* 📍 Autofill Button */}
      <button
        className="autofill-btn"
        onClick={handleAutofill}
        disabled={autoFillLoading}
      >
        {autoFillLoading
          ? t("fertilizerRecommendation.loading")
          : t("fertilizerRecommendation.autofill")}
      </button>

      {/* 📝 Form */}
      <form onSubmit={handleSubmit} className="fertilizer-form">
        {/* 🔽 Crop Selection */}
        <select
          name="crop_type"
          onChange={handleChange}
          value={formData.crop_type}
          required
        >
          <option value="">{t("fertilizerRecommendation.select")}</option>
          {cropList.length > 0 ? (
            cropList.map((crop, index) => (
              <option key={index} value={crop}>
                {t(`crops.${crop.toLowerCase()}`)}
              </option>
            ))
          ) : (
            <option disabled>
              {t("fertilizerRecommendation.loadingCrops")}
            </option>
          )}
        </select>

        <input
          type="number"
          name="nitrogen"
          placeholder={t("fertilizerRecommendation.form.nitrogen")}
          onChange={handleChange}
          required
          value={formData.nitrogen}
        />
        <input
          type="number"
          name="phosphorous"
          placeholder={t("fertilizerRecommendation.form.phosphorous")}
          onChange={handleChange}
          required
          value={formData.phosphorous}
        />
        <input
          type="number"
          name="potassium"
          placeholder={t("fertilizerRecommendation.form.pottasium")}
          onChange={handleChange}
          required
          value={formData.potassium}
        />
        <input
          type="number"
          name="ph"
          placeholder={t("fertilizerRecommendation.form.phLevel")}
          onChange={handleChange}
          required
          value={formData.ph}
        />

        <button type="submit" disabled={loading}>
          {loading
            ? t("fertilizerRecommendation.recommending")
            : t("fertilizerRecommendation.recommend")}
        </button>
      </form>

      {/* 🌱 Styled Recommendation Box */}
      {recommendation && recommendation.organic_fertilizer && (
        <div className="fertilizer-container recommendation-box">
          <h3>{t("fertilizerRecommendation.title")}</h3>
          <div className="fertilizer-details">
            {(() => {
              let highlighted = {
                nitrogen_high: false,
                nitrogen_low: false,
                phosphorous_high: false,
                phosphorous_low: false,
                potassium_high: false,
                potassium_low: false,
              };

              return recommendation.organic_fertilizer
                .split("\n")
                .map((line, index) => {
                  let lowerLine = line.toLowerCase();

                  const makeBoldWithRed = (text) =>
                    text.replace(
                      /\b(HIGH|LOW)\b/gi,
                      (match) => `<span class="red-highlight">${match}</span>`
                    );

                  // 🔴 Nitrogen Highlight
                  if (
                    !highlighted.nitrogen_high &&
                    lowerLine.includes("nitrogen is high")
                  ) {
                    highlighted.nitrogen_high = true;
                    return (
                      <p key={index} className="bold-line">
                        •{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: makeBoldWithRed(line),
                          }}
                        />
                      </p>
                    );
                  }
                  if (
                    !highlighted.nitrogen_low &&
                    lowerLine.includes("nitrogen is low")
                  ) {
                    highlighted.nitrogen_low = true;
                    return (
                      <p key={index} className="bold-line">
                        •{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: makeBoldWithRed(line),
                          }}
                        />
                      </p>
                    );
                  }

                  // 🟡 Phosphorous Highlight
                  if (
                    !highlighted.phosphorous_high &&
                    lowerLine.includes("phosphorous is high")
                  ) {
                    highlighted.phosphorous_high = true;
                    return (
                      <p key={index} className="bold-line">
                        •{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: makeBoldWithRed(line),
                          }}
                        />
                      </p>
                    );
                  }
                  if (
                    !highlighted.phosphorous_low &&
                    lowerLine.includes("phosphorous is low")
                  ) {
                    highlighted.phosphorous_low = true;
                    return (
                      <p key={index} className="bold-line">
                        •{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: makeBoldWithRed(line),
                          }}
                        />
                      </p>
                    );
                  }

                  // 🟢 Potassium Highlight
                  if (
                    !highlighted.potassium_high &&
                    lowerLine.includes("potassium is high")
                  ) {
                    highlighted.potassium_high = true;
                    return (
                      <p key={index} className="bold-line">
                        •{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: makeBoldWithRed(line),
                          }}
                        />
                      </p>
                    );
                  }
                  if (
                    !highlighted.potassium_low &&
                    lowerLine.includes("potassium is low")
                  ) {
                    highlighted.potassium_low = true;
                    return (
                      <p key={index} className="bold-line">
                        •{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: makeBoldWithRed(line),
                          }}
                        />
                      </p>
                    );
                  }

                  // Default text without highlight
                  return (
                    <p key={index} className="normal-text">
                      {line}
                    </p>
                  );
                });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerRecommendation;
