import React, { useState, useEffect } from "react";
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
  
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'public/cities.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.state_arr !== 'undefined') {
        setStatesList(window.state_arr);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "state") {
      updateCities(value);
    }
  };

  const updateCities = (selectedState) => {
    if (typeof window.s_a !== 'undefined') {
      const stateIndex = window.state_arr.findIndex(state => state === selectedState);
      
      if (stateIndex !== -1) {
        const citiesString = window.s_a[stateIndex + 1];
        const cities = citiesString.split("|").slice(1); 
        setCitiesList(cities);
        setFormData(prev => ({ ...prev, city: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          {statesList.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label>City:</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          disabled={!formData.state}
        >
          <option value="">Select City</option>
          {citiesList.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        <button type="submit">Predict</button>
      </form>
    </div>
  );
};

export default CropRecommendation;