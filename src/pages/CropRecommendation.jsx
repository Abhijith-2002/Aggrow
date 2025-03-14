import React, { useState, useEffect } from "react";
import "../styles/CropRecommendation.css";
import Papa from "papaparse"; 

const YOUR_OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY
const YOUR_OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY

const CropRecommendation = () => {
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
  
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [rainfallData, setRainfallData] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [currentSeason, setCurrentSeason] = useState("");
  const [rainfallInfo, setRainfallInfo] = useState(null);

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

    loadRainfallData();
    determineCurrentSeason();

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to determine current season based on month
const determineCurrentSeason = () => {
  const currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)
  
  if (currentMonth >= 2 && currentMonth <= 4) {
    setCurrentSeason("Mar-May"); // Spring season
  } else if (currentMonth >= 5 && currentMonth <= 8) {
    setCurrentSeason("Jun-Sep"); // Monsoon season
  } else {
    setCurrentSeason("Oct-Dec"); // Winter season
  }
};

// Function to load rainfall data from CSV
const loadRainfallData = async () => {
  try {
    const response = await fetch('/rainFallData.csv'); // Adjust path as needed
    const csvText = await response.text();
    
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        setRainfallData(results.data);
        console.log("Rainfall data loaded successfully", results.data.slice(0, 5));
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      }
    });
  } catch (error) {
    console.error("Error loading rainfall data:", error);
  }
};

// Function to update rainfall data from selected district
const updateRainfallFromDistrict = (districtData) => {
  if (!districtData) return;
  
  // Get rainfall for current season or month
  let rainfallValue;
  
  if (currentSeason) {
    rainfallValue = districtData[currentSeason];
  } else {
    // Fallback to current month
    const currentMonth = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
    rainfallValue = districtData[currentMonth];
  }
  
  if (rainfallValue) {
    setFormData(prev => ({ ...prev, rainfall: parseFloat(rainfallValue) }));
    
    // Set rainfall info for display
    setRainfallInfo({
      district: districtData.DISTRICT,
      state: districtData.STATE_UT_NAME,
      current: rainfallValue,
      annual: calculateAnnualRainfall(districtData),
      seasonal: {
        spring: districtData["Mar-May"],
        monsoon: districtData["Jun-Sep"],
        winter: districtData["Oct-Dec"]
      }
    });
  }
};

// Calculate annual rainfall
const calculateAnnualRainfall = (districtData) => {
  if (!districtData) return 0;
  
  // Sum the seasonal data
  const spring = parseFloat(districtData["Mar-May"] || 0);
  const monsoon = parseFloat(districtData["Jun-Sep"] || 0);
  const winter = parseFloat(districtData["Oct-Dec"] || 0);
  
  // Add January and February if available
  const jan = parseFloat(districtData["JAN"] || 0);
  const feb = parseFloat(districtData["FEB"] || 0);
  
  return (spring + monsoon + winter + jan + feb).toFixed(1);
};

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
          setLocationError("Unable to get your location. Please select state and city manually.");
          setIsLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Please select state and city manually.");
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
        const city = result.city || result.town || result.village;
        
        if (state && city) {
          // Find the state in our list
          const stateIndex = window.state_arr.findIndex(
            s => s.toLowerCase() === state.toLowerCase()
          );
          
          if (stateIndex !== -1) {
            const selectedState = window.state_arr[stateIndex];
            setFormData(prev => ({ ...prev, state: selectedState }));
            
            // Update cities for the selected state
            updateCities(selectedState);
            
            // Then set the city if it's in our list
            setTimeout(() => {
              const cityMatch = citiesList.find(
                c => c.toLowerCase() === city.toLowerCase()
              );
              
              if (cityMatch) {
                setFormData(prev => ({ ...prev, city: cityMatch }));
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
      setLocationError("Error determining your location. Please select state and city manually.");
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

    // For district selection
    if (name === "district" && value) {
      const districtData = rainfallData.find(
        item => 
          item.STATE_UT_NAME.toLowerCase() === formData.state.toLowerCase() && 
          item.DISTRICT === value
      );
  
    if (districtData) {
      updateRainfallFromDistrict(districtData);
      // Also update city if possible
      setFormData(prev => ({ ...prev, city: value }));
    }
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

  useEffect(() => {
    if (formData.state && rainfallData.length > 0) {
      const districts = rainfallData
        .filter(item => item.STATE_UT_NAME.toLowerCase() === formData.state.toLowerCase())
        .map(item => item.DISTRICT);
    
      setDistrictOptions([...new Set(districts)]); // Remove duplicates
    }
  }, [formData.state, rainfallData]);

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
      
      {isLoading && <p className="loading-message">Loading location and weather data...</p>}
      {locationError && <p className="error-message">{locationError}</p>}
      
      <div className="location-controls">
        <button 
          type="button" 
          onClick={getUserLocation} 
          disabled={isLoading}
          className="location-button"
        >
          Use My Location
        </button>
      </div>

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

        <label>District:</label>
        <select
          name="district"
          value={formData.district || ""}
          onChange={handleChange}
          disabled={!formData.state}
        >
          <option value="">Select District</option>
          {districtOptions.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        <div className="weather-info">
          <div className="weather-field">
            <label>Temperature (°C):</label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="Auto-filled from location"
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
              placeholder="Auto-filled from location"
              required
            />
          </div>
        </div>

        {rainfallInfo && (
          <div className="rainfall-info">
            <h3>Rainfall Data for {rainfallInfo.district}</h3>
            <div className="rainfall-details">
              <p><strong>Current Season:</strong> {currentSeason}</p>
              <p><strong>Season Rainfall:</strong> {rainfallInfo.current} mm</p>
              <p><strong>Annual Avg Rainfall:</strong> {rainfallInfo.annual} mm</p>
              <p><strong>Spring (Mar-May):</strong> {rainfallInfo.seasonal.spring} mm</p>
              <p><strong>Monsoon (Jun-Sep):</strong> {rainfallInfo.seasonal.monsoon} mm</p>
              <p><strong>Winter (Oct-Dec):</strong> {rainfallInfo.seasonal.winter} mm</p>
            </div>
          </div>
        )}

        <button type="submit">Predict</button>
      </form>
    </div>
  );
};

export default CropRecommendation;