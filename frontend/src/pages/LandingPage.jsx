import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";



export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (token) {
    window.location.href = '/main'; // or use navigate('/main') if using React Router
  } else {
    window.location.href = '/';
  }
};

  return (
    <div className="landing-page">

      {/* ===================== NAVBAR ===================== */}
      <header className="site-header">
        
        <div className="logo">
          
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

        <div className="hero-left">
          <img src="/fimg.png" className="hero-image" alt="EcoTravel Hero" />
        </div>
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

          <button className="btn btn-primary cta" onClick={() => navigate("/login")}>Plan Your Eco Trip</button>
        </div>
      </main>
      <footer className="footer">
  <div className="footer-content">
    <p>&copy; 2026 EcoTravel. All rights reserved.</p>
    <p>Developed by: Nandhana • Monisha • Sindhuja</p>
  </div>
</footer>


    </div>
  );
}
