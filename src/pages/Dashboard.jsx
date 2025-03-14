import "../styles/Dashboard.css";
import Header from "./Header";
import ContentSection from "./ContentSection";

import React from "react";
import { Link } from "react-router-dom";
const Dashboard = () => {
  return (
    <div className="app">
      <Header />
      <ContentSection />
    </div>
  );
};
// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <h1>Welcome to Aggrow</h1>
//       <p>Select an option to proceed:</p>

//       <div className="dashboard-options">
//         <Link to="/crop-recommendation" className="dashboard-card">
//           🌱 Crop Recommendation
//         </Link>
//         <Link to="/fertilizer-recommendation" className="dashboard-card">
//           🧪 Fertilizer Recommendation
//         </Link>
//         <Link to="/disease-detection" className="dashboard-card">
//           📷 Disease Detection
//         </Link>
//       </div>
//     </div>
//   );
// };

export default Dashboard;
