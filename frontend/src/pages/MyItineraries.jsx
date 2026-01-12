import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MyItineraries.css";
import API_BASE_URL from "../../config";  // Adjust path: ../config or ../../config


export default function MyItineraries() {
  const [itineraries, setItineraries] = useState([]);
    const [activeSection, setActiveSection] = useState('home');

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/itineraries`, {  // ✅ FIXED URL
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    setItineraries(data);
    console.log('✅ Loaded itineraries:', data.length);  // ✅ DEBUG
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    setLoading(false);
  }
};


  const deleteItinerary = async (id) => {
    if (confirm('Delete this itinerary permanently?')) {
      try {
        await fetch(`/api/itineraries/${id}`, { 
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setItineraries(itineraries.filter(it => it._id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return <div className="loading">Loading itineraries...</div>;

  return (
    <div className="myitineraries-container">
      {/* ===================== NAVBAR ===================== */}
      <header className="site-header">
        <div className="logo">
          <div className="brand">EcoTravel</div>
          <div className="tagline">Sustainable Travel Planner</div>
        </div>

        <nav className="main-nav">
  <a 
    className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
    onClick={() => navigate('/main')}

  >
    Home
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
      <div className="header">
        <h1>📂 My Itineraries</h1>
        <div className="header-actions">
          <button className="back-main-btn" onClick={() => navigate('/main')}>
            ← Back to Home
          </button>
          <button className="new-plan-btn" onClick={() => navigate('/plan-itinerary')}>
            ➕ New Itinerary
          </button>
        </div>
      </div>

      {itineraries.length === 0 ? (
        <div className="empty-state">
          <h3>No itineraries yet</h3>
          <p>Create your first eco-friendly trip plan!</p>
          <button 
            className="cta-btn" 
            onClick={() => navigate('/plan-itinerary')}
          >
            🧭 Start Planning
          </button>
        </div>
      ) : (
        <div className="itineraries-grid">
          {itineraries.map(itinerary => (
            <div key={itinerary._id} className="itinerary-card">
              <div className="card-header">
                <h3>{itinerary.title}</h3>
                <div className="card-meta">
                  <span className="distance">{itinerary.totalDistance}km</span>
                  <span className="duration">{itinerary.totalDuration}</span>
                  <span className="days">{itinerary.totalDays} days</span>
                </div>
              </div>
              
              <div className="card-stops">
                <strong>Stops:</strong> {itinerary.stops?.length || 0}
                {itinerary.startLocation && (
                  <div className="start-location">
                    📍 {itinerary.startLocation.name}
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/plan-itinerary/${itinerary._id}`)}
                >
                  ✏️ Edit Plan
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteItinerary(itinerary._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <footer className="footer">
  <div className="footer-content">
    <p>&copy; 2026 EcoTravel. All rights reserved.</p>
    <p>Developed by: Nandhana • Monisha • Sindhuja</p>
  </div>
</footer>

    </div>
  );
}
