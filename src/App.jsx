import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CropRecommendation from "./pages/CropRecommendation";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import DiseaseDetection from "./pages/DiseaseDetection";

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
