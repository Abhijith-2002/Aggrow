
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import CropRecommendation from "./pages/CropRecommendation/CropRecommendation.jsx";
import FertilizerRecommendation from "./pages/FertilizerRecommendation/FertilizerRecommendation.jsx";
import DiseaseDetection from "./pages/DiseaseDetection/DiseaseDetection.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/crop-recommendation" element={<CropRecommendation />} />
      <Route
        path="/fertilizer-recommendation"
        element={<FertilizerRecommendation />}
      />
      <Route path="/disease-detection" element={<DiseaseDetection />} />
    </Routes>
  );
}

export default App;
