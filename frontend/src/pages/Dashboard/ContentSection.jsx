import React from "react";
import "./ContentSection.css";

const ContentSection = () => {
  return (
    <div className="content-section">
      <div className="about-section">
        <h2>About Aggrow</h2>
        <p>
          Aggrow is an innovative agricultural technology platform designed to
          help farmers optimize their crop yields through data-driven insights
          and AI-powered recommendations.
        </p>
        <p>
          Our mission is to empower farmers with cutting-edge technology that
          simplifies decision-making, reduces resource wastage, and maximizes
          productivity while promoting sustainable farming practices.
        </p>
        <p>
          Founded by a team of agricultural experts and technology enthusiasts,
          Aggrow combines traditional farming wisdom with modern machine
          learning algorithms to provide practical solutions to everyday farming
          challenges.
        </p>
      </div>

      <div className="services-section">
        <h2>Our Services</h2>
        <div className="service-card">
          <h3>Disease Detection</h3>
          <p>
            Identify plant diseases early through image recognition technology.
            Simply upload a photo of your affected plant, and our AI will
            diagnose the issue and suggest treatment options.
          </p>
        </div>

        <div className="service-card">
          <h3>Crop Recommendation</h3>
          <p>
            Get personalized crop suggestions based on your soil composition,
            local climate data, and market trends to maximize your yield and
            profitability.
          </p>
        </div>

        <div className="service-card">
          <h3>Fertilizer Recommendation</h3>
          <p>
            Receive tailored fertilizer recommendations based on soil tests and
            crop requirements to ensure optimal plant nutrition while minimizing
            environmental impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
