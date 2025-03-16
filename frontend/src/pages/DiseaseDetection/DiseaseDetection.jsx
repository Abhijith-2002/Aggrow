import React, { useState } from "react";
import "./DiseaseDetection.css";
import { useTranslation } from "react-i18next"; // Add this import

const DiseaseDetection = () => {
  const { t } = useTranslation(); // Add translation hook
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert(t("diseaseDetection.noFileError"));
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Simulate API call (replace with actual backend endpoint)
    const response = await fetch(
      "https://your-api-endpoint/disease-detection",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    alert(`${t("diseaseDetection.result")} ${data.prediction}`);
  };

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

        <button type="submit">{t("common.predict")}</button>
      </form>
    </div>
  );
};

export default DiseaseDetection;