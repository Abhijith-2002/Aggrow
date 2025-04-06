import React, { useState } from "react";
import "./DiseaseDetection.css";
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
    <div className="disease-detection">
      <h2>
        <FaLeaf /> Plant Doctor
      </h2>

      <div className="upload-box">
        <label>
          <FaUpload /> {selectedFile ? selectedFile.name : "Choose Image"}
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
          {loading ? "Analyzing..." : "Diagnose"}
        </button>
      </div>

      {loading && <div className="loading">Scanning plant...</div>}

      {error && (
        <div className="error">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {result && (
        <div className="result-card">
          <h3>
            {result.name}
            <span className="confidence">{result.confidence}% sure</span>
          </h3>

          <p className="description">{result.description}</p>

          <div className="treatment-section">
            <h4>Recommended Treatments:</h4>
            <ul>
              {Object.entries(result.treatments).map(([type, tips]) => (
                <div key={type}>
                  <h5>{type.charAt(0).toUpperCase() + type.slice(1)}:</h5>
                  {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;
