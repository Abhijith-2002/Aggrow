import axios from "axios";

const API_BASE_URL = "http://localhost:5173"; // Change this if your backend is deployed elsewhere

// Fetch Dashboard Data
export const fetchDashboardData = async () => {
  try {
    console.log("Dashboard here!!!");
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};

// Crop Recommendation
export const getCropRecommendation = async (soilData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/crop-recommendation`,
      soilData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching crop recommendation:", error);
    return null;
  }
};

// Fertilizer Recommendation
export const getFertilizerRecommendation = async (soilData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fertilizer-recommendation`,
      soilData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching fertilizer recommendation:", error);
    return null;
  }
};

// Disease Detection
export const detectDisease = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(
      `${API_BASE_URL}/disease-detection`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error detecting disease:", error);
    return null;
  }
};
