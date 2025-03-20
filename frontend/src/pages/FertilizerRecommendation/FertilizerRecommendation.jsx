import React, { useState } from "react";
import axios from "axios";
import "./FertilizerRecommendation.css";

const FertilizerRecommendation = () => {
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    crop_type: "",
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    ph: "",
  });

  const [prediction, setPrediction] = useState({
    organic_fertilizer: "",
    inorganic_fertilizer: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📍 Fetch GPS & Autofill Data
  const handleAutofill = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Location:", latitude, longitude);

        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/fertilizer/autofill?lat=${latitude}&lon=${longitude}`
          );

          if (response.data) {
            setFormData((prev) => ({
              ...prev,
              temperature: response.data.temperature || prev.temperature,
              humidity: response.data.humidity || prev.humidity,
              moisture: response.data.moisture || prev.moisture,
              soil_type: response.data.soil_type || prev.soil_type,
              nitrogen: response.data.nitrogen || prev.nitrogen,
              phosphorous: response.data.phosphorous || prev.phosphorous,
              potassium: response.data.potassium || prev.potassium,
              ph: response.data.ph || prev.ph,
            }));
          }
        } catch (error) {
          console.error("Autofill Error:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setLoading(false);
      }
    );
  };

  // Submit Form & Get Prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/fertilizer/predict",
        formData
      );
      setPrediction(response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fertilizer-container">
      <h2>Fertilizer Recommendation</h2>

      <button
        className="autofill-btn"
        onClick={handleAutofill}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Autofill Data 📍"}
      </button>

      <form onSubmit={handleSubmit} className="fertilizer-form">
        <input
          type="number"
          name="temperature"
          placeholder="Temperature"
          onChange={handleChange}
          required
          value={formData.temperature}
        />
        <input
          type="number"
          name="humidity"
          placeholder="Humidity"
          onChange={handleChange}
          required
          value={formData.humidity}
        />
        <input
          type="number"
          name="moisture"
          placeholder="Moisture"
          onChange={handleChange}
          required
          value={formData.moisture}
        />
        <input
          type="text"
          name="soil_type"
          placeholder="Soil Type"
          onChange={handleChange}
          value={formData.soil_type}
        />
        <input
          type="text"
          name="crop_type"
          placeholder="Crop Type"
          onChange={handleChange}
          required
          value={formData.crop_type}
        />
        <input
          type="number"
          name="nitrogen"
          placeholder="Nitrogen (N)"
          onChange={handleChange}
          required
          value={formData.nitrogen}
        />
        <input
          type="number"
          name="phosphorous"
          placeholder="Phosphorous (P)"
          onChange={handleChange}
          required
          value={formData.phosphorous}
        />
        <input
          type="number"
          name="potassium"
          placeholder="Potassium (K)"
          onChange={handleChange}
          required
          value={formData.potassium}
        />
        <input
          type="number"
          name="ph"
          placeholder="pH Level"
          onChange={handleChange}
          value={formData.ph}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {prediction && (
        <div className="prediction-result">
          <h3>Organic Fertilizer Recommendation</h3>
          <p>{prediction.organic_fertilizer}</p>

          {prediction.inorganic_fertilizer && (
            <div>
              <h3>Inorganic Fertilizer Option</h3>
              <p>{prediction.inorganic_fertilizer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FertilizerRecommendation;
