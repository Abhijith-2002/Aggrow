import "./Dashboard.css";
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

export default Dashboard;
