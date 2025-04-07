import React, { useState, useEffect } from "react";
import "./CropRecommendation.css";
import Header from "../Dashboard/Header";
import { useTranslation } from "react-i18next";
import {
  FaLocationArrow,
  FaTemperatureLow,
  FaTint,
  FaSpinner,
  FaLeaf,
  FaRedo,
  FaAtom,
  FaFire,
  FaBolt,
  FaBalanceScale,
  FaCloudRain,
  FaMapMarkerAlt,
  FaCity,
  FaExclamationTriangle,
} from "react-icons/fa";

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
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/cities.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.state_arr !== "undefined") {
        setStatesList(window.state_arr);
        getUserLocation();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
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

  const getLocationDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${
          import.meta.env.VITE_OPENCAGE_API_KEY
        }`
      );
      const data = await response.json();

      if (data.results?.length > 0) {
        const result = data.results[0].components;
        const state = result.state;
        const city = result.state_district;

        if (state && city) {
          setIsLocationFetched(true);
          const stateIndex = window.state_arr.findIndex(
            (s) => s.toLowerCase() === state.toLowerCase()
          );

          if (stateIndex !== -1) {
            const selectedState = window.state_arr[stateIndex];
            setFormData((prev) => ({ ...prev, state: selectedState }));
            updateCities(selectedState);

            setTimeout(() => {
              const cityMatch = citiesList.find(
                (c) => c.toLowerCase() === city.toLowerCase()
              );
              if (cityMatch)
                setFormData((prev) => ({ ...prev, city: cityMatch }));
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

  const getWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${
          import.meta.env.VITE_OPENWEATHERMAP_API_KEY
        }`
      );
      const data = await response.json();

      if (data) {
        setFormData((prev) => ({
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

  const getWeatherDataByCity = async (city, state) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},IN&units=metric&appid=${
          import.meta.env.VITE_OPENWEATHERMAP_API_KEY
        }`
      );
      const data = await response.json();

      if (data) {
        setFormData((prev) => ({
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

    if (name === "state") {
      updateCities(value);
      setFormData((prev) => ({
        ...prev,
        city: "",
        temperature: "",
        humidity: "",
      }));
    }

    if (name === "city" && value && formData.state) {
      getWeatherDataByCity(value, formData.state);
    }
  };

  const updateCities = (selectedState) => {
    if (typeof window.s_a !== "undefined") {
      const stateIndex = window.state_arr.findIndex(
        (state) => state === selectedState
      );
      if (stateIndex !== -1) {
        const citiesString = window.s_a[stateIndex + 1];
        const cities = citiesString.split("|").slice(1);
        setCitiesList(cities);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setPredictionError("");
    setPredictionLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/crop-recommendation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (data.success) {
        setPrediction(data.recommendedCrop);
      } else {
        setPredictionError(data.error || "Failed to get recommendation");
      }
    } catch (error) {
      console.error("Error getting crop recommendation:", error);
      setPredictionError("Failed to connect to prediction service");
    } finally {
      setPredictionLoading(false);
    }
  };

  const renderPredictionResults = () => (
    <div className="prediction-result">
      <h2>
        <FaLeaf className="icon" />{" "}
        {t("cropRecommendation.prediction.recommendedCrop")}
      </h2>
      <div className="crop-name">{t(`crops.${prediction.toLowerCase()}`)}</div>

      <div className="crop-details">
        <h3>{t("cropRecommendation.prediction.inputDetails")}:</h3>
        <ul>
          <li>
            <span className="detail-label">N-P-K:</span>
            {formData.nitrogen} - {formData.phosphorous} - {formData.pottasium}
          </li>
          <li>
            <span className="detail-label">pH:</span> {formData.ph}
          </li>
          <li>
            <span className="detail-label">
              {t("cropRecommendation.prediction.rainfall")}:
            </span>
            {formData.rainfall} mm
          </li>
          <li>
            <span className="detail-label">
              <FaTemperatureLow />{" "}
              {t("cropRecommendation.prediction.temperature")}:
            </span>
            {formData.temperature}°C
          </li>
          <li>
            <span className="detail-label">
              <FaTint /> {t("cropRecommendation.prediction.humidity")}:
            </span>
            {formData.humidity}%
          </li>
        </ul>
      </div>

      <button
        className="new-prediction-button"
        onClick={() => setPrediction(null)}
      >
        <FaRedo /> {t("cropRecommendation.prediction.newPrediction")}
      </button>
    </div>
  );

  return (
    <div className="crop-recommendation-app">
      <Header />
      <div className="crop-recommendation-container">
        <h1>{t("cropRecommendation.title")}</h1>
        <p className="subtitle">{t("cropRecommendation.subtitle")}</p>

        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t("cropRecommendation.loadingMessage")}</p>
          </div>
        )}

        {locationError && (
          <div className="error-message">
            <FaExclamationTriangle /> {locationError}
          </div>
        )}

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
                <FaLocationArrow /> {t("cropRecommendation.locationButton")}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="crop-form">
              <div className="form-group">
                <label htmlFor="nitrogen">
                  <FaAtom /> {t("cropRecommendation.form.nitrogen")} (kg/ha)
                </label>
                <input
                  type="number"
                  id="nitrogen"
                  name="nitrogen"
                  className="form-control"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phosphorous">
                  <FaFire /> {t("cropRecommendation.form.phosphorous")} (kg/ha)
                </label>
                <input
                  type="number"
                  id="phosphorous"
                  name="phosphorous"
                  className="form-control"
                  value={formData.phosphorous}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pottasium">
                  <FaBolt /> {t("cropRecommendation.form.pottasium")} (kg/ha)
                </label>
                <input
                  type="number"
                  id="pottasium"
                  name="pottasium"
                  className="form-control"
                  value={formData.pottasium}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ph">
                  <FaBalanceScale /> {t("cropRecommendation.form.ph")}
                </label>
                <input
                  type="number"
                  id="ph"
                  name="ph"
                  className="form-control"
                  value={formData.ph}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="6.5"
                  min="0"
                  max="14"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rainfall">
                  <FaCloudRain /> {t("cropRecommendation.form.rainfall")} (mm)
                </label>
                <input
                  type="number"
                  id="rainfall"
                  name="rainfall"
                  className="form-control"
                  value={formData.rainfall}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="150"
                  min="0"
                  required
                />
              </div>

              {!isLocationFetched && (
                <>
                  <div className="form-group">
                    <label htmlFor="state">
                      <FaMapMarkerAlt /> {t("cropRecommendation.form.state")}
                    </label>
                    <select
                      id="state"
                      name="state"
                      className="form-control"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        {t("cropRecommendation.form.selectState")}
                      </option>
                      {statesList.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">
                      <FaCity /> {t("cropRecommendation.form.city")}
                    </label>
                    <select
                      id="city"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      disabled={!formData.state}
                    >
                      <option value="">
                        {t("cropRecommendation.form.selectCity")}
                      </option>
                      {citiesList.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="weather-info">
                <div className="form-group">
                  <label htmlFor="temperature">
                    <FaTemperatureLow />{" "}
                    {t("cropRecommendation.form.temperature")} (°C)
                  </label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    className="form-control"
                    value={formData.temperature}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="25.5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="humidity">
                    <FaTint /> {t("cropRecommendation.form.humidity")} (%)
                  </label>
                  <input
                    type="number"
                    id="humidity"
                    name="humidity"
                    className="form-control"
                    value={formData.humidity}
                    onChange={handleChange}
                    placeholder="80"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="predict-btn"
                disabled={predictionLoading || isLoading}
              >
                {predictionLoading ? (
                  <>
                    <FaSpinner className="spinner-icon" />
                    {t("common.predicting")}
                  </>
                ) : (
                  t("common.predict")
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
