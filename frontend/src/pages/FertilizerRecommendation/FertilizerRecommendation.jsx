import React, { useState } from "react";
import "./FertilizerRecommendation.css";
import { useTranslation } from "react-i18next"; // Import the translation hook

const FertilizerRecommendation = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    pottasium: "",
    cropname: "",
  });

  const crops = [
    "rice",
    "maize",
    "chickpea",
    "kidneybeans",
    "pigeonpeas",
    "mothbeans",
    "mungbean",
    "blackgram",
    "lentil",
    "pomegranate",
    "banana",
    "mango",
    "grapes",
    "watermelon",
    "muskmelon",
    "apple",
    "orange",
    "papaya",
    "coconut",
    "cotton",
    "jute",
    "coffee",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cropname) {
      alert(t("fertilizerRecommendation.noCropError")); // Use translation for error message
      return;
    }

    try {
      const response = await fetch("https://your-api-endpoint/fert-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(`${t("fertilizerRecommendation.result")} ${data.recommendation}`); // Use translation for result message
    } catch (error) {
      alert(t("errors.connectionFailed")); // Use translation for connection error
    }
  };

  return (
    <div className="fertilizer-container">
      <h2>{t("fertilizerRecommendation.title")}</h2> {/* Use translation for title */}

      <form onSubmit={handleSubmit} className="fertilizer-form">
        <label>
          <b>{t("fertilizerRecommendation.form.nitrogen")}</b> {/* Use translation for label */}
        </label>
        <input
          type="number"
          name="nitrogen"
          placeholder={t("fertilizerRecommendation.form.nitrogenPlaceholder")}
          value={formData.nitrogen}
          onChange={handleChange}
          required
        />

        <label>
          <b>{t("fertilizerRecommendation.form.phosphorous")}</b> {/* Use translation for label */}
        </label>
        <input
          type="number"
          name="phosphorous"
          placeholder={t("fertilizerRecommendation.form.phosphorousPlaceholder")}
          value={formData.phosphorous}
          onChange={handleChange}
          required
        />

        <label>
          <b>{t("fertilizerRecommendation.form.pottasium")}</b> {/* Use translation for label */}
        </label>
        <input
          type="number"
          name="pottasium"
          placeholder={t("fertilizerRecommendation.form.pottasiumPlaceholder")}
          value={formData.pottasium}
          onChange={handleChange}
          required
        />

        <label>
          <b>{t("fertilizerRecommendation.form.cropLabel")}</b> {/* Use translation for label */}
        </label>
        <select
          name="cropname"
          value={formData.cropname}
          onChange={handleChange}
          required
        >
          <option value="">{t("fertilizerRecommendation.form.selectCrop")}</option> {/* Use translation for placeholder */}
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {t(`crops.${crop}`)} {/* Use translation for crop names */}
            </option>
          ))}
        </select>

        <button type="submit">{t("common.predict")}</button> {/* Use translation for button text */}
      </form>
    </div>
  );
};

export default FertilizerRecommendation;