import React from "react";
import { Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Make sure this path points to your i18n.js file
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import CropRecommendation from "./pages/CropRecommendation/CropRecommendation.jsx";
import FertilizerRecommendation from "./pages/FertilizerRecommendation/FertilizerRecommendation.jsx";
import DiseaseDetection from "./pages/DiseaseDetection/DiseaseDetection.jsx";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Routes>
        {/* Dashboard handles all hash-based navigation */}
        <Route path="/*" element={<Dashboard />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route
          path="/fertilizer-recommendation"
          element={<FertilizerRecommendation />}
        />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
      </Routes>
    </I18nextProvider>
  );
}

export default App;
