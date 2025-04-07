import React, { useState } from "react";
import "./DiseaseDetection.css";
import Header from "../Dashboard/Header";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  FaLeaf,
  FaUpload,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getDiseaseInfo } from "./diseaseDatabase";

const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:5000/api/disease-detection",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setResult({
          diseaseClass: response.data.prediction,
          confidence: response.data.confidence.toFixed(2),
          ...getDiseaseInfo(response.data.prediction),
        });
        console.log(response.data);
      } else {
        throw new Error(response.data.error || "Prediction failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-detection-app">
      <Header />
      <div className="disease-detection">
        <h2>
          <FaLeaf /> Plant Doctor
        </h2>

        <div className="upload-box">
          <label>
            <FaUpload />{" "}
            {selectedFile
              ? selectedFile.name
              : t("diseaseDetection.form.imageInput")}
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              hidden
            />
          </label>

          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="preview-image" />
          )}

          <button onClick={handleSubmit} disabled={!selectedFile || loading}>
            {loading ? <FaSpinner className="spin" /> : <FaCheck />}
            {loading
              ? t("diseaseDetection.analysis")
              : t("diseaseDetection.diagnose")}
          </button>
        </div>

        {loading && (
          <div className="loading">{t("diseaseDetection.form.scanning")}</div>
        )}

        {error && (
          <div className="error">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            <h3>
              {console.log(result)}
              {
                t(`diseaseDetection.Diseases.${result.diseaseClass}.name`) !==
                `diseaseDetection.Diseases.${result.diseaseClass}.name`
                  ? t(`diseaseDetection.Diseases.${result.diseaseClass}.name`) // Use translated name if available
                  : result.name /* Fallback to the disease class name */
              }
              <span className="confidence">{result.confidence}% sure</span>
            </h3>

            <p className="description">
              {
                t(
                  `diseaseDetection.Diseases.${result.diseaseClass}.description`
                ) !==
                `diseaseDetection.Diseases.${result.diseaseClass}.description`
                  ? t(
                      `diseaseDetection.Diseases.${result.diseaseClass}.description`
                    ) // Use translated description if available
                  : result.description /* Fallback to the original description */
              }
            </p>

            <div className="treatment-section">
              <h4>{t("diseaseDetection.recommendedTreatment")}</h4>
              <ul>
                {Object.entries(result.treatments).map(([type, tips]) => (
                  <div key={type}>
                    <h4>{t(`diseaseDetection.types.${type}`)}:</h4>
                    {tips.map((tip, i) => {
                      const translatedTip = t(
                        `diseaseDetection.Diseases.${
                          result.diseaseClass
                        }.treatments.${type}.${i + 1}`
                      );
                      return (
                        <li key={i}>
                          {
                            translatedTip !==
                            `diseaseDetection.Diseases.${
                              result.diseaseClass
                            }.treatments.${type}.${i + 1}`
                              ? translatedTip // Use the translated value if it exists
                              : tip /* Fallback to the original tip if translation is missing */
                          }
                        </li>
                      );
                    })}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;
