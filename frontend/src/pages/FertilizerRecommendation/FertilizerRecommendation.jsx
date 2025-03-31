import React, { useState } from "react";
import axios from "axios";
import cropList from "./crops.json";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        } finally {
          setAutoFillLoading(false);
        }
      },
      (error) => {
        alert("❌ Unable to retrieve location. Please enable GPS.");
        setAutoFillLoading(false);
      }
    );
  };

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fertilizer-container">
      <h2>{t("fertilizerRecommendation.title")}</h2>
      <button
        className="autofill-btn"
        onClick={handleAutofill}
        disabled={autoFillLoading}
      >
        {autoFillLoading
          ? t("fertilizerRecommendation.loading")
          : t("fertilizerRecommendation.autofill")}
      </button>
      <form onSubmit={handleSubmit} className="fertilizer-form">
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
      {recommendation && recommendation.organic_fertilizer && (
        <div className="fertilizer-container recommendation-box">
          <h3>{t("fertilizerRecommendation.title")}</h3>
          <div className="fertilizer-details">
            {recommendation.organic_fertilizer
              .split("\n")
              .filter((line) => line.trim())
              .map((line, index) => {
                let size = 0;
                function generateUniqueRandomNumbers(n, count) {
                  if (count > n) {
                    return "Error: Count cannot be greater than n.";
                  }
                  const numbers = [];
                  for (let i = 1; i <= n; i++) {
                    numbers.push(i);
                  }
                  const result = [];
                  for (let i = 0; i < count; i++) {
                    const randomIndex = Math.floor(
                      Math.random() * numbers.length
                    );
                    result.push(numbers.splice(randomIndex, 1)[0]);
                  }
                  return result;
                }
                if (line == "N_max") {
                  size = 5;
                } else if (line == "N_min") {
                  size = 7;
                } else if (line == "P_max") {
                  size = 6;
                } else if (line == "P_min") {
                  size = 7;
                } else if (line == "K_max") {
                  size = 4;
                } else if (line == "K_min") {
                  size = 7;
                } else if (line == "pH_max") {
                  size = 5;
                } else if (line == "pH_min") {
                  size = 5;
                }
                let n = generateUniqueRandomNumbers(size, 4);
                const Strategies = [];
                for (let i = 0; i < n.length; i++) {
                  Strategies.push(
                    t(
                      "fertilizerRecommendation.recommendation." +
                        line +
                        ".result." +
                        n[i]
                    )
                  );
                }
                return (
                  <React.Fragment key={index}>
                    <p className="highlight">
                      •{" "}
                      {t(
                        "fertilizerRecommendation.recommendation." +
                          line +
                          ".title"
                      )}
                    </p>
                    <p className="normal-text">1. {Strategies[0]}</p>
                    <p className="normal-text">2. {Strategies[1]}</p>
                    <p className="normal-text">3. {Strategies[2]}</p>
                    <p className="normal-text">4. {Strategies[3]}</p>
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerRecommendation;
