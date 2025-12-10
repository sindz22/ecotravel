import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function MainPage() {
  const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem("token");     // remove login token
    localStorage.setItem("flash", "Logged out successfully");

    navigate("/login");                   // redirect to login
  };

  return (
    <div className="Main-page">

      {/* ===================== NAVBAR ===================== */}
      <header className="site-header">
        <div className="logo">
          <div className="brand">EcoTravel BLR</div>
          <div className="tagline">Sustainable Travel Planner</div>
        </div>

        <nav className="main-nav">
          <a className="nav-item active">Home</a>
          <a className="nav-item">Explore</a>
          <a className="nav-item">About Us</a>
          <a className="nav-item">Contact Us</a>
        </nav>
         <div className="auth">
          <button 
            className="btn btn-primary" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ===================== HERO SECTION ===================== */}
      <main className="hero">

        {/* LEFT SIDE */}
        <div className="hero-left">

          {/* DOTTED PLANE PATHS */}
          <svg className="plane-paths" viewBox="0 0 800 300">
            <path d="M50 180 C200 60, 400 40, 650 140" className="path" />
            <path d="M80 140 C260 20, 480 70, 720 110" className="path" />
            <path d="M120 210 C300 100, 520 140, 760 160" className="path" />
          </svg>

          {/* PLANES */}
          <img src="/plane.png" className="plane p1" alt="" />
          <img src="/plane.png" className="plane p2" alt="" />
          <img src="/plane.png" className="plane p3" alt="" />

          {/* BACKGROUND BLOBS */}
          <div className="blob-layer layer1"></div>
          <div className="blob-layer layer2"></div>

          {/* MAIN IMAGE BLOB */}
          <div className="blob-mask">
            <img src="/blr.jpg" className="hero-img" alt="" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">
          <h6 className="eyebrow">TRAVEL GREEN. TRAVEL SMART.</h6>

          <h1 className="title">
            Explore Bangalore <br />
            The Eco-Friendly Way.
          </h1>

          <p className="lead">
            Build custom itineraries, compare travel modes, track your carbon savings,
            and explore Bangalore responsibly.
          </p>

          <button className="btn btn-primary cta">Plan Your Eco Trip</button>
        </div>
      </main>

    </div>
  );
}
