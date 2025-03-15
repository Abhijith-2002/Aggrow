import React, { useState } from "react";
import "./FertilizerRecommendation.css";

const FertilizerRecommendation = () => {
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
      alert("Please select a crop before submitting.");
      return;
    }

    const response = await fetch("https://your-api-endpoint/fert-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(`Recommended Fertilizer: ${data.recommendation}`);
  };

  return (
    <div className="fertilizer-container">
      <h2>Get informed advice on fertilizer based on soil</h2>

      <form onSubmit={handleSubmit} className="fertilizer-form">
        <label>
          <b>Nitrogen</b>
        </label>
        <input
          type="number"
          name="nitrogen"
          placeholder="Enter value (example: 50)"
          value={formData.nitrogen}
          onChange={handleChange}
          required
        />

        <label>
          <b>Phosphorous</b>
        </label>
        <input
          type="number"
          name="phosphorous"
          placeholder="Enter value (example: 50)"
          value={formData.phosphorous}
          onChange={handleChange}
          required
        />

        <label>
          <b>Pottasium</b>
        </label>
        <input
          type="number"
          name="pottasium"
          placeholder="Enter value (example: 50)"
          value={formData.pottasium}
          onChange={handleChange}
          required
        />

        <label>
          <b>Crop you want to grow</b>
        </label>
        <select
          name="cropname"
          value={formData.cropname}
          onChange={handleChange}
          required
        >
          <option value="">Select crop</option>
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        <button type="submit">Predict</button>
      </form>
    </div>
  );
};

export default FertilizerRecommendation;
