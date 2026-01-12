import React, { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import "./MainPage.css";
import API_BASE_URL from "../config";


export default function MainPage() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
const [activeSection, setActiveSection] = useState('home');

  const [selectedMode, setSelectedMode] = useState(null);
const [userPrefs, setUserPrefs] = useState({ travelPreferences: [] });
  const aboutRef = useRef(null);
  const modesRef = useRef(null);
  const contactRef = useRef(null);

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
// ✅ NEW: Fetch user preferences on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      try {
        // Decode JWT payload (assumes user prefs stored in token)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserPrefs(payload.user || { travelPreferences: [] });
      } catch (e) {
        // Fallback: fetch from API
        fetch(`${API_BASE_URL}/api/userprofile/login`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setUserPrefs(data))
          .catch(() => setUserPrefs({ travelPreferences: [] }));
      }
    }
  }, []);

  // ✅ REPLACE your ecoSpots array with this (online images - NO local files needed!)
const ecoSpots = [
  { 
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPu0GRh6sLARuSc8vQUTNsIE7n4AWX54v2Vg&sfit=crop", 
    alt: "Lalbagh Botanical Garden", 
    tags: ["Nature", "Culture", "Walking"], 
    area: "South Bengaluru" 
  },
  { 
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCgMIya6pYsTm6ebvx5KIJQlRh3SlF98VDAg&sfit=crop", 
    alt: "Cubbon Park trails", 
    tags: ["Nature", "Relaxation", "Cycling"], 
    area: "MG Road" 
  },
  { 
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_CMdBxbMGSeaj8mZkiLOpG_yGs70Snhrpvg&sfit=crop", 
    alt: "Bannerghatta Safari", 
    tags: ["Adventure", "Nature"], 
    area: "Bannerghatta Rd" 
  },
  { 
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PzPMqRKV8EU3U2CbLpctHfA0KgSMvLf9uQ&sfit=crop", 
    alt: "Hebbal Lake eco-boating", 
    tags: ["Nature", "Relaxation", "Public Transport"], 
    area: "North Bengaluru" 
  },
  { 
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYKEU0P8xFODXLF59D07_ho_9sHWYCl3B3A&sfit=crop", 
    alt: "Hesaraghatta cycling trail", 
    tags: ["Adventure", "Cycling"], 
    area: "Northwest" 
  },
  { 
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=220&fit=crop", 
    alt: "Turahalli Forest hike", 
    tags: ["Adventure", "Nature", "Walking"], 
    area: "Southwest" 
  },
  { 
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqoG3Y3-tF-iy23_YBZhlZhsXcdsrdaZWjwg&sfit=crop", 
    alt: "Nandi Hills green view", 
    tags: ["Adventure", "Nature"], 
    area: "Chikkaballapur" 
  },
  { 
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpXpM5PkhBGPCoRMDffvY8TpXs6AtCCVui-A&sfit=crop", 
    alt: "Sankey Tank walk", 
    tags: ["Nature", "Relaxation"], 
    area: "Malleshwaram" 
  }
];


  // Filter spots by user signup preferences
  const filteredSpots = ecoSpots.filter(spot => 
    userPrefs.travelPreferences.length === 0 || 
    spot.tags.some(tag => userPrefs.travelPreferences.includes(tag))
  );

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        setError("");
      },
      () => {
        setError("Location permission denied");
      }
    );
  };
const handleLogout = () => {
    localStorage.removeItem("token");     // remove login token

    navigate("/");                   // redirect to login
  };

  const scrollToSection = (section) => {
  setActiveSection(section);
  
  const refs = {
    home: null,
    explore: modesRef,    // ✅ Explore -> modesRef (Travel Modes section)
    about: aboutRef,      // ✅ About -> aboutRef  
    contact: contactRef   // ✅ Contact -> contactRef
  };
  
  const targetRef = refs[section];
  
  if (targetRef?.current) {
    targetRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  } else if (section === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};


  return (
    <div className="Main-page">

      {/* ===================== NAVBAR ===================== */}
      <header className="site-header">
        <div className="logo">
          
          <div className="brand">EcoTravel</div>
          <div className="tagline">Sustainable Travel Planner</div>
        </div>

        <nav className="main-nav">
  <a 
    className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
    onClick={() => scrollToSection('home')}
  >
    Home
  </a>
  <a 
    className={`nav-item ${activeSection === 'explore' ? 'active' : ''}`} 
    onClick={() => scrollToSection('explore')}
  >
    Explore
  </a>
  <a 
    className={`nav-item ${activeSection === 'about' ? 'active' : ''}`} 
    onClick={() => scrollToSection('about')}
  >
    About Us
  </a>
  <a 
    className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} 
    onClick={() => scrollToSection('contact')}
  >
    Contact
  </a>
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

        <div className="hero-left">
          <img src="/fimg.png" className="hero-image" alt="EcoTravel Hero" />
        </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">
          <h6 className="eyebrow">TRAVEL GREEN. TRAVEL SMART.</h6>

          <h1 className="title">
            Explore  <br />
            The Eco-Friendly Way.
          </h1>

          <p className="lead">
            Build custom itineraries, compare travel modes, track your carbon savings,
            and explore Bangalore responsibly.
          </p>

          <button className="btn btn-primary cta" onClick={() => navigate("/plan-itinerary")} >Plan Your Eco Trip</button>
        </div>
      </main>
      <main className="Explore">
        <section className="location-section">
  <h2>📍 Where are you right now?</h2>

  <div className="location-box">
    <input
      type="text"
      placeholder="Enter your city or location"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />

    <button onClick={getCurrentLocation}>
      Use Current Location
    </button>
  </div>

  {error && <p className="error">{error}</p>}
</section>

      </main>
      <section className="actions-section">
  <h2>What would you like to do?</h2>

  <div className="action-buttons">
    <button onClick={() => navigate("/plan-itinerary")}>
   🧭 Plan an Itinerary
</button>
    

    <button
      className="btn btn-outline"
      onClick={() => navigate("/my-itineraries")}
    >
      📂 View Existing Plans
    </button>
  </div>
</section>
 {/* ✅ NEW: ECO CAROUSEL SECTION - Inserted here for perfect flow */}
      <section className="eco-carousel-section">
        <h2>🌿 Eco Spots Near {location} for Your Interests</h2>
        <p>Matching your preferences: {userPrefs.travelPreferences.join(', ') || 'All green adventures'}</p>
        <div className="eco-carousel">
          {filteredSpots.map((spot, index) => (
            <div key={index} className="eco-card">
              <img src={spot.src} alt={spot.alt} loading="lazy" />
              <div className="spot-info">
                <h3>{spot.alt}</h3>
                <p>{spot.area} • {spot.tags.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
{/* ===================== ABOUT US ===================== */}
      <section ref={aboutRef} className="info-section">
        <h2>About Us</h2>
        <p>
          EcoTravel BLR helps users plan sustainable travel by promoting
          eco-friendly transportation, responsible stays, and low-carbon itineraries.
        </p>
      </section>

      {/* ===================== TRAVEL MODES ===================== */}
      <section ref={modesRef} className="info-section modes">
  <h2>Travel Modes</h2>

  <div className="modes-grid">
    <div
      className="mode-card"
      onClick={() =>
        setSelectedMode(selectedMode === "walking" ? null : "walking")
      }
    >
      🚶‍♂️ Walking
    </div>

    <div
      className="mode-card"
      onClick={() =>
        setSelectedMode(selectedMode === "cycling" ? null : "cycling")
      }
    >
      🚲 Cycling
    </div>

    <div
      className="mode-card"
      onClick={() =>
        setSelectedMode(selectedMode === "bus" ? null : "bus")
      }
    >
      🚌 Public Transport
    </div>

    <div
      className="mode-card"
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
