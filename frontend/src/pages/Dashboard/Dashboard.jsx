import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Header from "./Header";
import ContentSection from "./ContentSection";
import { FaLeaf, FaSeedling, FaDiagnoses } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="dashboard-app">
      <Header />
      
      <main className="dashboard-main">
        <div className="dashboard-hero">
          <h1 className="dashboard-title">
            Welcome to <span>Aggrow</span>
          </h1>
          <p className="dashboard-subtitle">
            Your AI-powered agricultural assistant
          </p>
        </div>

        <div className="dashboard-options">
          <Link to="/disease-detection" className="dashboard-card disease-card">
            <FaDiagnoses className="dashboard-icon" />
            <h3>Disease Detection</h3>
            <p>Identify plant health issues instantly</p>
          </Link>
          
          <Link to="/crop-recommendation" className="dashboard-card crop-card">
            <FaSeedling className="dashboard-icon" />
            <h3>Crop Recommendation</h3>
            <p>Find optimal crops for your land</p>
          </Link>
          
          <Link to="/fertilizer-recommendation" className="dashboard-card fertilizer-card">
            <FaLeaf className="dashboard-icon" />
            <h3>Fertilizer Recommendation</h3>
            <p>Get personalized nutrition plans</p>
          </Link>
        </div>
      </main>

      <ContentSection />
    </div>
  );
};

export default Dashboard;