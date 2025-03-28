import React, { useState, useCallback } from "react";
import "./DiseaseDetection.css";
import { useTranslation } from "react-i18next";

const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const parseCures = useCallback((cures) => {
    if (!cures) return null;

    const sections = {
      title: "",
      organicTreatments: [],
      chemicalTreatments: [],
      importantNotes: []
    };

    try {
      const lines = cures.split('\n');
      let currentSection = null;

      lines.forEach(line => {
        if (line.includes("Bell Pepper")) {
          sections.title = line.replace(/\*/g, '').trim();
        } else if (line.includes("Organic Treatments")) {
          currentSection = 'organicTreatments';
        } else if (line.includes("Chemical Treatments")) {
          currentSection = 'chemicalTreatments';
        } else if (line.includes("Important Note")) {
          currentSection = 'importantNotes';
        } else if (line.trim() && currentSection) {
          sections[currentSection].push(line.trim());
        }
      });

      return sections;
    } catch (parseError) {
      console.error("Error parsing cures:", parseError);
      return null;
    }
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError(t("diseaseDetection.noFileError"));
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/disease-detection", {
        method: "POST",
        body: formData,
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setResult({
          prediction: data.prediction,
          confidence: data.confidence,
          cures: data.cures,
        });
      } else {
        setError(data.error || t("diseaseDetection.serverError"));
      }
    } catch (error) {
      console.error("Prediction failed:", error);
      setError(t("diseaseDetection.fetchError"));
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, t]);

  const renderTreatmentSection = (title, treatments) => (
    treatments && treatments.length > 0 && (
      <div className="treatment-section">
        <h4>{title}</h4>
        <ul>
          {treatments.map((treatment, index) => (
            <li 
              key={index} 
              dangerouslySetInnerHTML={{ 
                __html: treatment
                  .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          ))}
        </ul>
      </div>
    )
  );

  return (
    <div className="disease-detection-container">
      <h2>{t("diseaseDetection.title")}</h2>
      <form onSubmit={handleSubmit} className="disease-form">
        <input
          type="file"
          name="file"
          className="form-control-file"
          id="inputfile"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
        {imagePreview && (
          <img
            id="output-image"
            src={imagePreview}
            alt={t("diseaseDetection.form.preview")}
            className="image-preview"
          />
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? t("common.loading") : t("common.predict")}
        </button>
      </form>

      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t("common.processing")}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-box">
          <div className="prediction-summary">
            <h3>{t("Result")}</h3>
            <p>
              <strong>{t("Prediction")}:</strong> {result.prediction}
            </p>
            {result.confidence && (
              <p>
                <strong>{t("Confidence")}:</strong> {result.confidence}%
              </p>
            )}
          </div>
          {result.cures && (
            <div className="disease-cures">
              {(() => {
                const parsedCures = parseCures(result.cures);
                return parsedCures ? (
                  <div>
                    {parsedCures.title && <h3>{parsedCures.title}</h3>}
                    
                    {renderTreatmentSection(
                      "Organic Treatments", 
                      parsedCures.organicTreatments
                    )}
                    
                    {renderTreatmentSection(
                      "Chemical Treatments", 
                      parsedCures.chemicalTreatments
                    )}
                    
                    {parsedCures.importantNotes && parsedCures.importantNotes.length > 0 && (
                      <div className="important-notes">
                        <h4>Important Notes</h4>
                        <p>{parsedCures.importantNotes.join(' ')}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{result.cures}</p>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;