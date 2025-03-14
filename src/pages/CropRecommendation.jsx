import React, { useState } from "react";
import "../styles/CropRecommendation.css";

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    pottasium: "",
    ph: "",
    rainfall: "",
    state: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate API call (replace with actual API request)
    const response = await fetch("https://your-api-endpoint/crop-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(`Recommended Crop: ${data.recommendedCrop}`);
  };

  return (
    <div className="crop-recommendation-container">
      <h1>Crop Recommendation</h1>
      <p>Enter the soil and climate details to get a recommended crop.</p>

      <form onSubmit={handleSubmit} className="crop-form">
        <label>Nitrogen:</label>
        <input
          type="number"
          name="nitrogen"
          value={formData.nitrogen}
          onChange={handleChange}
          placeholder="Enter value (e.g., 50)"
          required
        />

        <label>Phosphorous:</label>
        <input
          type="number"
          name="phosphorous"
          value={formData.phosphorous}
          onChange={handleChange}
          placeholder="Enter value (e.g., 50)"
          required
        />

        <label>Pottasium:</label>
        <input
          type="number"
          name="pottasium"
          value={formData.pottasium}
          onChange={handleChange}
          placeholder="Enter value (e.g., 50)"
          required
        />

        <label>pH Level:</label>
        <input
          type="number"
          step="0.01"
          name="ph"
          value={formData.ph}
          onChange={handleChange}
          placeholder="Enter value"
          required
        />

        <label>Rainfall (in mm):</label>
        <input
          type="number"
          step="0.01"
          name="rainfall"
          value={formData.rainfall}
          onChange={handleChange}
          placeholder="Enter value"
          required
        />

        <label>State:</label>
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          <option value="Kerala">Kerala</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Maharashtra">Maharashtra</option>
          {/* Add more states here */}
        </select>

        <label>City:</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        >
          <option value="">Select City</option>
          <option value="Kochi">Kochi</option>
          <option value="Chennai">Chennai</option>
          <option value="Mumbai">Mumbai</option>
          {/* Add more cities dynamically based on selected state */}
        </select>

        <button type="submit">Predict</button>
      </form>
    </div>
  );
};

export default CropRecommendation;
