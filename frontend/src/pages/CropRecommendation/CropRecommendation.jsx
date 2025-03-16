import React, { useState, useEffect } from "react";
import "./CropRecommendation.css";
import { useTranslation } from "react-i18next";

const YOUR_OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY
const YOUR_OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY

const CropRecommendation = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    pottasium: "",
    ph: "",
    rainfall: "",
    state: "",
    city: "",
    temperature: "",
    humidity: "",
  });

  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  
  // New state variables for prediction results
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  // This useEffect will run once when component mounts to load the states data
  useEffect(() => {
    // Import the cities.js file
    const script = document.createElement('script');
    script.src = '/cities.js';
    script.async = true;
    script.onload = () => {
      // Once the script is loaded, populate the states
      if (typeof window.state_arr !== 'undefined') {
        setStatesList(window.state_arr);

        // Try to get user location once states are loaded
        getUserLocation();
      }
    };
    document.body.appendChild(script);

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to get user's location
  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Get state and city from coordinates
          getLocationDetails(latitude, longitude);
        },
        (error) => {
          console.error("Error obtaining location", error);
          setLocationError(t("cropRecommendation.locationError"));
          setIsLoading(false);
        }
      );
    } else {
      setLocationError(t("cropRecommendation.geolocationNotSupported"));
      setIsLoading(false);
    }
  };

  // Function to get location details from coordinates
  const getLocationDetails = async (latitude, longitude) => {
    try {
      // Using OpenCage Geocoding API (you'll need to register for a free API key)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${YOUR_OPENCAGE_API_KEY}`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0].components;

        // Extract state and city from response
        // Note: field names might vary depending on the country
        const state = result.state;
        const city = result.state_district;
        console.log(city)

        if (state && city) {
          setIsLocationFetched(true); // Mark location as fetched
        
          // Find the state in our list
          const stateIndex = window.state_arr.findIndex(
            (s) => s.toLowerCase() === state.toLowerCase()
          );
        
          if (stateIndex !== -1) {
            const selectedState = window.state_arr[stateIndex];
            setFormData((prev) => ({ ...prev, state: selectedState }));
        
            // Update cities for the selected state
            updateCities(selectedState);
        
            // Then set the city if it's in our list
            setTimeout(() => {
              const cityMatch = citiesList.find(
                (c) => c.toLowerCase() === city.toLowerCase()
              );
        
              if (cityMatch) {
                setFormData((prev) => ({ ...prev, city: cityMatch }));
              }
        
              // Get weather data for the location
              getWeatherData(latitude, longitude);
            }, 500);
          } else {
            getWeatherData(latitude, longitude);
          }
        } else {
          getWeatherData(latitude, longitude);
        }        
      }
    } catch (error) {
      console.error("Error getting location details", error);
      setLocationError(t("cropRecommendation.locationDeterminingError"));
      setIsLoading(false);
    }
  };

  // Function to get weather data based on coordinates
  const getWeatherData = async (latitude, longitude) => {
    try {
      // Using OpenWeatherMap API (you'll need to register for a free API key)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${YOUR_OPENWEATHERMAP_API_KEY}`
      );

      const data = await response.json();

      if (data) {
        setFormData(prev => ({
          ...prev,
          temperature: data.main.temp.toFixed(1),
          humidity: data.main.humidity,
        }));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error getting weather data", error);
      setIsLoading(false);
    }
  };

  // Function to get weather data based on city name
  const getWeatherDataByCity = async (city, state) => {
    try {
      setIsLoading(true);

      // Using OpenWeatherMap API with city name
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},IN&units=metric&appid=${YOUR_OPENWEATHERMAP_API_KEY}`
      );

      const data = await response.json();

      if (data) {
        setFormData(prev => ({
          ...prev,
          temperature: data.main.temp.toFixed(1),
          humidity: data.main.humidity,
        }));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error getting weather data for city", error);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If state changes, update cities list
    if (name === "state") {
      updateCities(value);
      // Reset city when state changes
      setFormData(prev => ({ ...prev, city: "", temperature: "", humidity: "" }));
    }

    // If city changes, get weather data
    if (name === "city" && value && formData.state) {
      getWeatherDataByCity(value, formData.state);
    }
  };

  // Function to update cities based on selected state
  const updateCities = (selectedState) => {
    if (typeof window.s_a !== 'undefined') {
      // Find the index of the selected state in state_arr
      const stateIndex = window.state_arr.findIndex(state => state === selectedState);

      if (stateIndex !== -1) {
        // Get cities for the selected state (adding 1 because s_a is 1-indexed)
        const citiesString = window.s_a[stateIndex + 1];
        // Split the cities string into an array
        const cities = citiesString.split("|").slice(1); // Remove the first empty element
        setCitiesList(cities);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous prediction results
    setPrediction(null);
    setPredictionError("");
    setPredictionLoading(true);

    try {
      // Send data to our backend API
      const response = await fetch("http://localhost:5000/api/crop-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setPrediction(data.recommendedCrop);
      } else {
        setPredictionError(data.error || "Failed to get recommendation");
      }
    } catch (error) {
      console.error("Error getting crop recommendation:", error);
      setPredictionError("Failed to connect to prediction service. Please try again later.");
    } finally {
      setPredictionLoading(false);
    }
  };

  // Function to render crop recommendation results
  const renderPredictionResults = () => {
    if (predictionLoading) {
      return <div className="prediction-loading">Analyzing soil and climate data...</div>;
    }
    
    if (predictionError) {
      return <div className="prediction-error">Error: {predictionError}</div>;
    }
    
    if (prediction) {
      return (
        <div className="prediction-result">
          <h2>{t("cropRecommendation.prediction.recommendedCrop")}</h2>
          <div className="crop-name">{prediction}</div>
          
          <div className="crop-details">
            <p>{t("cropRecommendation.prediction.inputDetails")}:</p>
            <ul>
              <li>{t("cropRecommendation.prediction.npk")}: {formData.nitrogen} - {formData.phosphorous} - {formData.pottasium}</li>
              <li>{t("cropRecommendation.prediction.ph")}: {formData.ph}</li>
              <li>{t("cropRecommendation.prediction.rainfall")}: {formData.rainfall} mm</li>
              <li>{t("cropRecommendation.prediction.temperature")}: {formData.temperature}°C</li>
              <li>{t("cropRecommendation.prediction.humidity")}: {formData.humidity}%</li>
            </ul>
          </div>
          
          <button 
            className="new-prediction-button" 
            onClick={() => setPrediction(null)}
          >
            {t("cropRecommendation.prediction.newPrediction")}
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="crop-recommendation-container">
      <h1>{t("cropRecommendation.title")}</h1>
      <p>{t("cropRecommendation.subtitle")}</p>

      {isLoading && <p className="loading-message">{t("cropRecommendation.loadingMessage")}</p>}
      {locationError && <p className="error-message">{locationError}</p>}

      {prediction ? (
        renderPredictionResults()
      ) : (
        <>
          <div className="location-controls">
            <button
              type="button"
              onClick={getUserLocation}
              disabled={isLoading}
              className="location-button"
            >
              {t("cropRecommendation.locationButton")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="crop-form">
            <label>{t("cropRecommendation.form.nitrogen")}</label>
            <input
              type="number"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleChange}
              placeholder={t("cropRecommendation.form.nitrogenPlaceholder")}
              required
            />

            <label>{t("cropRecommendation.form.phosphorous")}</label>
            <input
              type="number"
              name="phosphorous"
              value={formData.phosphorous}
              onChange={handleChange}
              placeholder={t("cropRecommendation.form.phosphorousPlaceholder")}
              required
            />

            <label>{t("cropRecommendation.form.pottasium")}</label>
            <input
              type="number"
              name="pottasium"
              value={formData.pottasium}
              onChange={handleChange}
              placeholder={t("cropRecommendation.form.pottasiumPlaceholder")}
              required
            />

            <label>{t("cropRecommendation.form.ph")}</label>
            <input
              type="number"
              step="0.01"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              placeholder={t("cropRecommendation.form.phPlaceholder")}
              required
            />

            <label>{t("cropRecommendation.form.rainfall")}</label>
            <input
              type="number"
              step="0.01"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              placeholder={t("cropRecommendation.form.rainfallPlaceholder")}
              required
            />

            {!isLocationFetched && (
              <>
                <label>{t("cropRecommendation.form.state")}</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("cropRecommendation.form.selectState")}</option>
                  {statesList.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                ))}
                </select>

    <label>{t("cropRecommendation.form.city")}</label>
    <select
      name="city"
      value={formData.city}
      onChange={handleChange}
      required
      disabled={!formData.state}
    >
      <option value="">{t("cropRecommendation.form.selectCity")}</option>
      {citiesList.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </select>
  </>
)}


            <div className="weather-info">
              <div className="weather-field">
                <label>{t("cropRecommendation.form.temperature")}:</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder={t("cropRecommendation.form.temperaturePlaceholder")}
                  required
                />
              </div>

              <div className="weather-field">
                <label>Humidity (%):</label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  placeholder={t("cropRecommendation.form.humidityPlaceholder")}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={predictionLoading}>
              {predictionLoading ? t("common.predicting") : t("common.predict")}
            </button>
          </form>
        </>
      )}
      
      {predictionLoading && <div className="prediction-overlay">Processing...</div>}
    </div>
  );
};

export default CropRecommendation;