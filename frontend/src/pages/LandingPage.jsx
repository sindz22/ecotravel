import React, { useState, useRef } from "react";  // ✅ Added missing hooks
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import "./MainPage.css";  // ✅ Added for mode cards CSS

export default function LandingPage() {
  const navigate = useNavigate();

  // ✅ FIXED: Add missing state
  const [selectedMode, setSelectedMode] = useState(null);

  // ✅ FIXED: Add missing refs
  const aboutRef = useRef(null);
  const modesRef = useRef(null);
  const contactRef = useRef(null);

  // ✅ modeDetails object (already correct)
  const modeDetails = {
    walking: {
      title: "🚶‍♂️ Walking",
      text:
        "Walking is the most eco-friendly mode of travel. It produces zero carbon emissions, improves health, and helps reduce traffic congestion."
    },
    cycling: {
      title: "🚲 Cycling",
      text:
        "Cycling is a sustainable and efficient travel mode. It reduces pollution, saves fuel, and is ideal for short urban distances."
    },
    bus: {
      title: "🚌 Public Transport",
      text:
        "Public transport reduces the number of vehicles on roads, lowering carbon emissions per person and making cities more sustainable."
    },
    ev: {
      title: "⚡ Electric Vehicles",
      text:
        "Electric vehicles produce fewer emissions compared to petrol vehicles and help reduce air pollution when powered by clean energy."
    }
  };

  const handleLogoClick = () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      navigate('/main');  // ✅ Use navigate instead of window.location
    } else {
      navigate('/');  // ✅ Landing/home
    }
  };

  return (
    <div className="landing-page">
      {/* ===================== NAVBAR ===================== */}
      <header className="site-header">
        <div className="logo" onClick={handleLogoClick}>
          <div className="brand">EcoTravel</div>
          <div className="tagline">Sustainable Travel Planner</div>
        </div>

        <div className="auth">
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </header>

      {/* ===================== HERO SECTION ===================== */}
      <main className="hero">
        {/* LEFT SIDE */}
        <div className="hero-left">
          <img src="/fimg.png" className="hero-image" alt="EcoTravel Hero" />
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">
          <h6 className="eyebrow">TRAVEL GREEN. TRAVEL SMART.</h6>

          <h1 className="title">
            Explore Travel <br />
            The Eco-Friendly Way.
          </h1>

          <p className="lead">
            Build custom itineraries, compare travel modes, track your carbon savings,
            and explore Bangalore responsibly.
          </p>

          <button className="btn btn-primary cta" onClick={() => navigate("/login")}>
            Plan Your Eco Trip
          </button>
        </div>
        </main>

        {/* ===================== TRAVEL MODES ===================== */}
        <section ref={modesRef} className="info-section modes">
          <h2>Travel Modes</h2>

          <div className="modes-grid">
            <div
              className={`mode-card ${selectedMode === "walking" ? "active" : ""}`}
              onClick={() =>
                setSelectedMode(selectedMode === "walking" ? null : "walking")
              }
            >
              🚶‍♂️ Walking
            </div>

            <div
              className={`mode-card ${selectedMode === "cycling" ? "active" : ""}`}
              onClick={() =>
                setSelectedMode(selectedMode === "cycling" ? null : "cycling")
              }
            >
              🚲 Cycling
            </div>

            <div
              className={`mode-card ${selectedMode === "bus" ? "active" : ""}`}
              onClick={() =>
                setSelectedMode(selectedMode === "bus" ? null : "bus")
              }
            >
              🚌 Public Transport
            </div>

            <div
              className={`mode-card ${selectedMode === "ev" ? "active" : ""}`}
              onClick={() =>
                setSelectedMode(selectedMode === "ev" ? null : "ev")
              }
            >
              ⚡ Electric Vehicles
            </div>
          </div>

          {/* DETAILS BOX */}
          {selectedMode && (
            <div className="mode-details">
              <h3>{modeDetails[selectedMode].title}</h3>
              <p>{modeDetails[selectedMode].text}</p>
            </div>
          )}
        </section>

        {/* ===================== ABOUT US ===================== */}
        <section ref={aboutRef} className="info-section">
          <h2>About Us</h2>
          <p>
            EcoTravel helps users plan sustainable travel by promoting
            eco-friendly transportation, responsible stays, and low-carbon itineraries.
          </p>
        </section>

        {/* ===================== CONTACT ===================== */}
        <section ref={contactRef} className="info-section contact">
          <h2>Contact Us</h2>
          <p>Email: ecotravel@gmail.com</p>
          <p>Phone: +91 9XXXXXXXXX</p>
        </section>
      

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 EcoTravel. All rights reserved.</p>
          <p>Developed by: Nandhana • Monisha • Sindhuja</p>
        </div>
      </footer>
    </div>
  );
}
