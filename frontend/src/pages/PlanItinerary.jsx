import React, { useState, useEffect ,useRef } from "react";
import "./PlanItinerary.css";
import { getRoute } from "../api/routeApi";
import LocationSearch from "../components/LocationSearch";
import PlacesCheckboxList from "../components/PlacesCheckboxList";
import { useNavigate, useParams } from "react-router-dom";  // ✅ ADD useParams

const modeMap = {
  Walking: "foot-walking",
  Cycling: "cycling-regular", 
  Car: "driving-car",
  Train: "driving-rail",
  Flight: "flight-fastest",
};

const ALL_MODES = ["Walking", "Cycling", "Car", "Train", "Flight"];

const allowedModes = (distanceKm) => {
  const modes = ["Walking", "Cycling", "Car"];
  if (distanceKm >= 30) modes.push("Train");
  if (distanceKm >= 200) modes.push("Flight");
  return modes;
};

const getBestMode = (distanceKm) => {
  if (distanceKm <= 5) return "Walking";
  if (distanceKm <= 20) return "Cycling";
  if (distanceKm <= 100) return "Car";
  if (distanceKm <= 500) return "Train";
  return "Flight";
};

const getEcoClass = (mode) => {
  if (mode === "Walking" || mode === "Cycling") return "eco-best";
  if (mode === "Train") return "eco-good";
  if (mode === "Car") return "eco-medium";
  return "eco-poor";
};

export default function PlanItinerary() {
  const navigate = useNavigate();
const [activeSection, setActiveSection] = useState('home');
  const homeRef = useRef(null);
  const modesRef = useRef(null);   // ✅ ADD
const aboutRef = useRef(null);   // ✅ ADD
const contactRef = useRef(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [title, setTitle] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [legModes, setLegModes] = useState([]); 
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [placeSearches, setPlaceSearches] = useState({});
  const [tripDurationHours, setTripDurationHours] = useState(8);
  const [stops, setStops] = useState([{ place: null, note: "", duration: "" }]);
  const [hasAirports, setHasAirports] = useState({ start: true, end: true });
  const [legs, setLegs] = useState([]);
  const [returnDestination, setReturnDestination] = useState("none");
  const [customReturnPlace, setCustomReturnPlace] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [routeSummary, setRouteSummary] = useState(null);
  const [currentLegIndex, setCurrentLegIndex] = useState(-1);
  const [searchText, setSearchText] = useState({}); // ✅ ADD THIS
  const [returnMode, setReturnMode] = useState("Car");  // ✅ NEW

  const [isEditMode, setIsEditMode] = useState(false);  // ✅ NEW
  const { id } = useParams();  // ✅ GET ID FROM URL


  
useEffect(() => {
  console.log('🚀 useEffect id:', id);  // Debug
  if (id) {
    loadItinerary(id);
  }
}, [id]);

useEffect(() => {
  // If there are more stops than modes, extend legModes
  if (legModes.length < stops.length) {
    setLegModes(prev => {
      const newModes = [...prev];
      while (newModes.length < stops.length) {
        newModes.push(getBestMode(0)); // you can pass 0 or a distance
      }
      return newModes;
    });
  }
}, [stops.length, legModes.length]);


  // ✅ LOAD EXISTING ITINERARY FOR EDIT
const loadItinerary = async (itineraryId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/itineraries/${itineraryId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('📥 LOADED:', data);
      
      // Set all state IMMEDIATELY (no timeout needed)
      setTitle(data.title || '');
      setStartLocation(data.startLocation);
      setStops(data.stops?.map(s => ({ ...s })) || [{ place: null, note: '', duration: '' }]);
      setLegModes(data.legModes || []);
      setReturnDestination(data.returnDestination || 'none');
      setReturnMode(data.returnMode || 'Car');
      setSelectedPlaces(data.selectedPlaces || []);
      setIsEditMode(true);
      
      console.log('✅ Edit mode activated');
    }
  } catch (err) {
    console.error('Load error:', err);
  }
};


  // ✅ ONLY id - prevents infinite loop


  const ecoScore = (mode) => {
    if (mode === "Walking" || mode === "Cycling") return "Very Low Carbon 🌱";
    if (mode === "Train") return "Low Carbon ✅";
    if (mode === "Car") return "Moderate Carbon ⚠️";
    return "High Carbon ❌";
  };

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours}hr ${minutes}min` : `${minutes}min`;
  };

  const parseDurationString = (durStr) => {
    if (!durStr) return 0;
    const hrMatch = durStr.match(/(\d+)hr/);
    const minMatch = durStr.match(/(\d+)min/);
    const hours = hrMatch ? parseInt(hrMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
    return hours + minutes / 60;
  };

  const isAdjacentDuplicate = (location, stopIndex) => {
    if (stopIndex === 0) return false;
    const prevStop = stops[stopIndex - 1]?.place;
    if (!prevStop) return false;
    return Math.hypot(prevStop.lat - location.lat, prevStop.lon - location.lon) < 0.01;
  };

  const togglePlace = (place) => {
    setSelectedPlaces((prev) => {
      const exists = prev.find((p) => p.id === place.id);
      if (exists) return prev.filter((p) => p.id !== place.id);
      return [...prev, place];
    });
  };

  const handleDurationChange = (placeId, newDuration) => {
  setSelectedPlaces(prevSelected =>
    prevSelected.map(place =>
      place.id === placeId 
        ? { ...place, customDuration: parseFloat(newDuration) || place.defaultDuration }
        : place
    )
  );
};

    

  const addStop = () => {
    setStops((prev) => [...prev, { place: null, note: "", duration: "" }]);
    // ✅ Initialize mode for new leg
    setLegModes((prev) => [...prev, getBestMode(0)]);
  };

  const removeStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    const newLegs = legs.filter((_, i) => i !== index);
    const newLegModes = legModes.filter((_, i) => i !== index);
    setStops(newStops);
    setLegs(newLegs);
    setLegModes(newLegModes);
  };

  // ✅ NEW FIXED VERSION
const handleStopChange = (index, field, value) => {
  const updated = [...stops];
  updated[index][field] = value;
  setStops(updated);
  
  // ✅ FIXED: Trigger leg calculation + nearby places for EDIT MODE
  if (field === "place" && value) {
    // Initialize mode for this leg if needed
    if (!legModes[index]) {
      setLegModes(prev => {
        const newModes = [...prev];
        newModes[index] = getBestMode(0);
        return newModes;
      });
    }
    
    // ✅ Load nearby places for restored stop
    fetchNearbyPlaces(value.lat, value.lon, index);
    
    // Calculate leg distance
    calculateLeg(index);
  }
};


const handleModeChange = async (legIndex, mode) => {
  // Update state FIRST
  setLegModes(prevModes => {
    const newModes = [...prevModes];
    newModes[legIndex] = mode;
    return newModes;
  });
  
  // ✅ IMMEDIATELY calculate with NEW mode (no timeout!)
  if (startLocation && stops[legIndex]?.place) {
    const prevLocation = legIndex === 0 ? startLocation : stops[legIndex - 1].place;
    const currentLocation = stops[legIndex].place;
    const startCoords = { lat: Number(prevLocation.lat), lon: Number(prevLocation.lon) };
    const endCoords = { lat: Number(currentLocation.lat), lon: Number(currentLocation.lon) };
    
    try {
      const data = await getRoute(startCoords, endCoords, modeMap[mode]); // ✅ FRESH MODE!
      const summary = data.features[0].properties.summary;
      
      setLegs(prevLegs => {
        const newLegs = [...prevLegs];
        newLegs[legIndex] = {
          distance: (summary.distance / 1000).toFixed(1),
          duration: formatDuration(summary.duration),
          from: prevLocation.name,
          to: currentLocation.name,
          mode: mode, // ✅ CORRECT MODE!
        };
        return newLegs;
      });
    } catch (err) {
      console.error("Mode calc error:", err);
    }
  }
};




  const estimateVisitTimeHours = () => {
    const visitTime = selectedPlaces.reduce((total, place) => {
      return total + (place.customDuration || place.defaultDuration || 1.5);
    }, 0);
    
    const travelHours = parseDurationString(duration);
    const totalHours = visitTime + travelHours;
    const days = Math.ceil(totalHours / 24);
    const bufferHours = days * 3; // 3hr/day buffer
    
    return visitTime + bufferHours;
  };

  const calculateTotalDays = () => {
    const visitTime = estimateVisitTimeHours();
    const travelTime = parseDurationString(duration);
    const totalHours = visitTime + travelTime;
    return Math.ceil(totalHours / 24);
  };
const handleSave = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    return;
  }

  if (!title || !startLocation || stops.every(s => !s.place)) {
    alert("Please fill required fields");
    return;
  }
  
  // ✅ SKIP validation in edit mode or make optional
  if (!id && !validateTripDuration()) return;

  try {
    // ✅ DEFINE itineraryData FIRST
    const itineraryData = {
      title,
      startLocation,
      stops: stops.map(s => ({ ...s, place: s.place })),
      legModes,
      returnDestination,
      returnMode,
      selectedPlaces,
      totalDistance: distance || 0,
      totalDuration: duration || '0min',
      totalDays: calculateTotalDays(),
      routeSummary: routeSummary || null
    };

    console.log('💾 SAVING DATA:', itineraryData.title, 'stops:', itineraryData.stops.length);

    const url = id ? `http://localhost:5000/api/itineraries/${id}` : 'http://localhost:5000/api/itineraries';
    const method = id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(itineraryData)
    });

    console.log('Response status:', res.status);  // ✅ DEBUG

    if (res.ok) {
      alert(id ? '✅ Updated successfully!' : '✅ Saved successfully!');
      navigate('/main');
    } else {
      const errorData = await res.json();
      console.error('Save error:', errorData);
      alert(`Save failed: ${errorData.error || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('Network error:', err);
    alert('Network error - check backend');
  }
};

    


  const validateTripDuration = () => {
    const visitTime = estimateVisitTimeHours();
    const travelHours = parseDurationString(duration);
    const totalNeeded = visitTime + travelHours;
    
    if (totalNeeded <= tripDurationHours) return true;
    
    const breakdown = selectedPlaces
      .slice(0, 3)
      .map(p => `  • ${p.name}: ${(p.customDuration || p.defaultDuration).toFixed(1)}hr`)
      .join('\n');
    
    const message = 
      `⚠️ Time Conflict\n\n` +
      `Total needed: ${totalNeeded.toFixed(1)}hr\n` +
      `Your time: ${tripDurationHours}hr\n` +
      `Gap: ${(totalNeeded - tripDurationHours).toFixed(1)}hr short\n\n` +
      `Top time consumers:\n${breakdown}\n\n` +
      `Auto-extend to ${Math.ceil(totalNeeded)}hr?`;
    
    if (confirm(message)) {
      setTripDurationHours(Math.ceil(totalNeeded));
      return true;
    }
    return false;
  };

  const checkAirports = async (coords, which) => {
    try {
      const res = await fetch("http://localhost:5000/api/airports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });
      const data = await res.json();
      setHasAirports((prev) => ({ ...prev, [which]: data.elements?.length > 0 }));
    } catch (e) {
      console.error("Airport check failed", e);
    }
  };
  

  // ✅ FIXED: Single leg calculation
  const calculateLeg = async (legIndex) => {
  if (!startLocation || !stops[legIndex]?.place) return;
  
  const prevLocation = legIndex === 0 ? startLocation : stops[legIndex - 1].place;
  const currentLocation = stops[legIndex].place;
  
  const startCoords = { lat: Number(prevLocation.lat), lon: Number(prevLocation.lon) };
  const endCoords = { lat: Number(currentLocation.lat), lon: Number(currentLocation.lon) };

  // ✅ FORCE FRESH MODE - Read directly from state updater
  const mode = legModes[legIndex] || "Car";


  try {
    const data = await getRoute(startCoords, endCoords, modeMap[mode]);
    const summary = data.features[0].properties.summary;
    
    setLegs((prevLegs) => {
      const newLegs = [...prevLegs];
      newLegs[legIndex] = {
        distance: (summary.distance / 1000).toFixed(1),
        duration: formatDuration(summary.duration),
        from: prevLocation.name,
        to: currentLocation.name,
        mode: mode,  // ✅ Uses fresh mode
      };
      return newLegs;
    });
  } catch (err) {
    console.error("Leg calculation error:", err);
  }
};

  // ✅ FIXED: Complete route calculation with per-leg modes
  const calculateAllLegs = async () => {
    if (!startLocation || stops.every(s => !s.place)) return;

    const allLegs = [];
    let totalDistance = 0;
    let totalDurationMs = 0;

    // Initialize modes for all legs if needed
    

    // Forward legs
    for (let i = 0; i < stops.length; i++) {
      if (!stops[i]?.place) continue;
      
      const prevLocation = i === 0 ? startLocation : stops[i - 1].place;
      const currentLocation = stops[i].place;
      const mode = legModes[i] || getBestMode(0);
      
      const startCoords = { lat: Number(prevLocation.lat), lon: Number(prevLocation.lon) };
      const endCoords = { lat: Number(currentLocation.lat), lon: Number(currentLocation.lon) };

      try {
        const data = await getRoute(startCoords, endCoords, modeMap[mode]);
        const summary = data.features[0].properties.summary;
        const legDistance = summary.distance / 1000;
        
        allLegs[i] = {
          distance: legDistance.toFixed(1),
          duration: formatDuration(summary.duration),
          durationMs: summary.duration,
          from: prevLocation.name,
          to: currentLocation.name,
          mode: mode,
        };
        
        totalDistance += legDistance;
        totalDurationMs += summary.duration;
      } catch (err) {
        console.error(`Leg ${i} error:`, err);
      }
    }

    // Return leg
    if (returnDestination === "start" && stops[stops.length - 1]?.place) {
      const lastStop = stops[stops.length - 1].place;
      const mode = returnMode;  
      
      try {
        const data = await getRoute(
          { lat: Number(lastStop.lat), lon: Number(lastStop.lon) },
          { lat: Number(startLocation.lat), lon: Number(startLocation.lon) },
          modeMap[mode]
        );
        const summary = data.features[0].properties.summary;
        const legDistance = summary.distance / 1000;
        
        allLegs.push({
          distance: legDistance.toFixed(1),
          duration: formatDuration(summary.duration),
          durationMs: summary.duration,
          from: lastStop.name,
          to: startLocation.name,
          mode: mode,
          isReturn: true,
        });
        
        totalDistance += legDistance;
        totalDurationMs += summary.duration;
      } catch (err) {
        console.error("Return leg error:", err);
      }
    } else if (returnDestination === "custom" && customReturnPlace && stops[stops.length - 1]?.place) {
      const lastStop = stops[stops.length - 1].place;
      const mode = returnMode;
      
      try {
        const data = await getRoute(
          { lat: Number(lastStop.lat), lon: Number(lastStop.lon) },
          { lat: Number(customReturnPlace.lat), lon: Number(customReturnPlace.lon) },
          modeMap[mode]
        );
        const summary = data.features[0].properties.summary;
        const legDistance = summary.distance / 1000;
        
        allLegs.push({
          distance: legDistance.toFixed(1),
          duration: formatDuration(summary.duration),
          durationMs: summary.duration,
          from: lastStop.name,
          to: customReturnPlace.name,
          mode: mode,
          isReturn: true,
        });
        
        totalDistance += legDistance;
        totalDurationMs += summary.duration;
      } catch (err) {
        console.error("Custom return leg error:", err);
      }
    }

    setLegs(allLegs);
    setDistance(totalDistance.toFixed(1));
    setDuration(formatDuration(totalDurationMs));
  };

  // ✅ NEW: Generate beautiful green summary
  const calculateRoute = async () => {
    await calculateAllLegs();
    
    if (legs.length > 0) {
      const totalTravelHours = parseDurationString(duration);
      const sightseeingHours = selectedPlaces.reduce((t, p) => t + (p.customDuration || p.defaultDuration || 1.5), 0);
      const totalDays = calculateTotalDays();
      const bufferHours = totalDays * 3;
      
      setRouteSummary({
        legs,
        totalDistance: distance,
        totalTravel: duration,
        totalTravelHours,
        sightseeingHours,
        bufferHours,
        totalDays,
      });
    }
  };

  const fetchNearbyPlaces = async (lat, lon, stopIndex) => {
  console.log("🔍 Searching TOURIST places near:", lat, lon, "for stop", stopIndex);
  const delta = 0.3;
  
  const query = `[out:json];(
    node["tourism"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    node["tourism"="attraction"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    node["tourism"="museum"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    node["tourism"="zoo"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    node["historic"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    way["tourism"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    way["historic"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    relation["tourism"](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
  );out tags center;`;

  try {
    const res = await fetch("http://localhost:5000/api/overpass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    console.log("📡 Tourist data:", data.elements?.length);

    const cleaned = data.elements
      ?.filter(el => el.tags?.name && (el.tags.tourism || el.tags.historic))
      ?.map(el => {
        const tags = el.tags || {};
        const category = tags.tourism || tags.historic || "attraction";
        const latCoord = el.lat || el.center?.lat;
        const lonCoord = el.lon || el.center?.lon;
        
        let defaultDuration = 2.0;
        if (tags.tourism === "zoo" || tags.tourism === "museum") defaultDuration = 3.5;
        if (tags.tourism === "viewpoint") defaultDuration = 0.75;
        
        return {
          id: `${el.id}-${stopIndex}`, // ✅ UNIQUE ID per stop
          name: tags.name,
          lat: latCoord,
          lon: lonCoord,
          category,
          defaultDuration,
          customDuration: defaultDuration,
          score: tags.tourism === "attraction" ? 3 : 2,
          distanceFromCenter: Math.hypot(latCoord - lat, lonCoord - lon),
          stopIndex, // ✅ Track which stop this belongs to
        };
      })
      ?.filter(p => p.lat && p.lon)
      ?.sort((a, b) => b.score - a.score || a.distanceFromCenter - b.distanceFromCenter) || [];

    console.log("✨ TOURIST PLACES for stop", stopIndex, ":", cleaned.length);
    
    // ✅ Per-stop nearby places - don't overwrite global nearbyPlaces
    setPlaceSearches(prev => ({
      ...prev, 
      [stopIndex]: { places: cleaned.slice(0, 50), visible: 10 }
    }));
  } catch (err) {
    console.error("❌ Overpass failed:", err);
  }
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
    
  <div className="plan-container">
    
    <h1><center>🌿 {isEditMode ? '✏️ Edit' : 'Plan'} Your Eco Itinerary</center></h1>

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

    <div className="section">
      <label>Itinerary Name *</label>
      <input
        type="text"
        placeholder="Weekend Green Trip"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <LocationSearch
        label="🚩 Start Location"
        value={startLocation}                    
        onSelect={(place) => {
          console.log("Start selected:", place);
          setStartLocation(place);
        }}
      />

    </div>

    <div className="section">
      <div className="section-header">
        <h3>🛣️ Destinations</h3>
        <button className="add-stop-btn" onClick={addStop}>+ Add Stop</button>
      </div>
      {stops.map((stop, index) => {
  const currentPlaceSearch =
    typeof placeSearches[index] === "string" ? placeSearches[index] : "";
  const currentSearchText = searchText[index] || "";

  return (
    <div key={index} className="stop-card">
      <span className="stop-badge">Stop {index + 1}</span>

      <LocationSearch
        label="Destination"
        value={stop.place}
        onSelect={(place) => {
          if (isAdjacentDuplicate(place, index)) {
            alert(
              `❌ Cannot visit "${place.name}" immediately after previous stop!`
            );
            return;
          }
          handleStopChange(index, "place", place);
          console.log("🎯 Destination selected:", place);
          fetchNearbyPlaces(place.lat, place.lon, index);
          setPlaceSearches((prev) => ({ ...prev, [index]: "" }));
        }}
      />

      {/* Per-leg mode selector */}
      <div className="mode-selector-section">
        <label>🚗 Mode for this leg</label>
        <div className="per-leg-modes">
          {ALL_MODES.map((mode) => {
            const legDistance = legs[index]?.distance || 0;
            const isBest = mode === getBestMode(legDistance);
            const currentMode = legModes[index];
            const isAllowed = allowedModes(legDistance).includes(mode);
            const isSelected = currentMode === mode;

            return (
              <button
                key={mode}
                className={`mode-btn-per-leg 
                  ${isSelected ? "active" : ""} 
                  ${isBest ? "best-mode" : ""} 
                  ${getEcoClass(mode)}
                  ${!isAllowed ? "disabled" : ""}`}
                onClick={() => isAllowed && handleModeChange(index, mode)}
                disabled={!isAllowed}
                title={`${mode} | Eco: ${ecoScore(
                  mode
                )} | Best for ${isBest ? "this distance" : "other distances"}`}
              >
                {mode === "Walking" && "🚶‍♂️"}
                {mode === "Cycling" && "🚴‍♂️"}
                {mode === "Car" && "🚗"}
                {mode === "Train" && "🚆"}
                {mode === "Flight" && "✈️"}
                <span>{mode}</span>
                {isBest && <span className="best-badge">⭐</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="stop-fields">
        <div className="field-group">
          <label>Duration (hours)</label>
          <input
            type="number"
            placeholder="2"
            value={stop.duration}
            onChange={(e) =>
              handleStopChange(index, "duration", e.target.value)
            }
          />
        </div>
        <div className="field-group">
          <label>Notes</label>
          <input
            type="text"
            placeholder="Optional notes..."
            value={stop.note}
            onChange={(e) => handleStopChange(index, "note", e.target.value)}
          />
        </div>
      </div>

      {stops.length > 1 && (
        <div className="stop-actions">
          <button
            className="remove-stop-btn"
            onClick={() => removeStop(index)}
          >
            🗑 Remove Stop
          </button>
        </div>
      )}

      {/* 🔍 SEARCH + LOAD MORE */}
      <button
        className="search-places-btn"
        onClick={() =>
          stop.place && fetchNearbyPlaces(stop.place.lat, stop.place.lon, index)
        }
        disabled={!stop.place}
      >
        🔍{" "}
        {placeSearches[index]?.places?.length
          ? `Refresh (${placeSearches[index].places.length})`
          : "Load Places"}
      </button>

      <div className="nearby-section">
        <div className="nearby-header">
          <input
            className="places-search"
            placeholder="🔍 Search..."
            value={currentSearchText}
            onChange={(e) =>
              setSearchText((prev) => ({
                ...prev,
                [index]: e.target.value,
              }))
            }
          />
          <span>
            (
            {placeSearches[index]?.places
              ?.filter((p) =>
                p.name
                  .toLowerCase()
                  .includes(currentSearchText.toLowerCase())
              ).length || 0}
            )
          </span>
        </div>

        <PlacesCheckboxList
          places={
            placeSearches[index]?.places
              ?.filter((p) =>
                p.name
                  .toLowerCase()
                  .includes(currentSearchText.toLowerCase())
              )
              ?.slice(0, placeSearches[index]?.visible || 10) || []
          }
          selectedPlaces={selectedPlaces}
          onToggle={togglePlace}
          onDurationChange={handleDurationChange}
        />

        {placeSearches[index]?.places
          ?.filter((p) =>
            p.name.toLowerCase().includes(currentSearchText.toLowerCase())
          ).length > (placeSearches[index]?.visible || 10) && (
          <button
            className="load-more-btn"
            onClick={() =>
              setPlaceSearches((prev) => ({
                ...prev,
                [index]: {
                  ...prev[index],
                  visible: (prev[index]?.visible || 10) + 10,
                },
              }))
            }
          >
            ⬇ Load More +10
          </button>
        )}
      </div>

      {/* Per-stop distance display */}
      {legs[index] && (
        <div className="leg-summary enhanced">
          📏 <strong>{legs[index].distance}km</strong> | ⏱️{" "}
          <strong>{legs[index].duration}</strong> | 🚗{" "}
          <span className={`mode-tag ${getEcoClass(legs[index].mode)}`}>
            {legs[index].mode}
          </span>
          <div className="leg-from">
            {legs[index].from} → {legs[index].to}
          </div>
        </div>
      )}
    </div>
  );
})}

    </div>
      {/* Return Destination */}
<div className="section">
  <h3>🔄 Return Destination</h3>
  <div className="return-options">
    <label>
      <input type="radio" name="return" value="none" checked={returnDestination === "none"} onChange={e => setReturnDestination(e.target.value)} />
      No return (one-way)
    </label>
    <label>
      <input type="radio" name="return" value="start" checked={returnDestination === "start"} onChange={e => setReturnDestination(e.target.value)} />
      Back to start ({startLocation?.name || "Not selected"})
    </label>
    <label>
      <input type="radio" name="return" value="custom" checked={returnDestination === "custom"} onChange={e => setReturnDestination(e.target.value)} />
      Custom destination
    </label>
  </div>
  
  {returnDestination === "custom" && (
    <LocationSearch label="Return to"
    value={customReturnPlace}                
    onSelect={place => setCustomReturnPlace(place)} />
  )}
  
  {/* ✅ NEW: Return Mode Selector */}
  {(returnDestination === "start" || returnDestination === "custom") && (
    <div className="return-mode-section">
      <label>🔄 Return Mode</label>
      <div className="per-leg-modes">
        {ALL_MODES.map(mode => (
          <button
            key={mode}
            className={`mode-btn-per-leg ${returnMode === mode ? "active" : ""} ${getEcoClass(mode)}`}
            onClick={() => setReturnMode(mode)}
          >
            {mode === "Walking" && "🚶‍♂️"}
            {mode === "Cycling" && "🚴‍♂️"}
            {mode === "Car" && "🚗"}
            {mode === "Train" && "🚆"}
            {mode === "Flight" && "✈️"}
            <span>{mode}</span>
          </button>
        ))}
      </div>
    </div>
  )}
  
  {/* ✅ NEW: Return Leg Time Display */}
  {(returnDestination !== "none" && legs[legs.length - 1]?.isReturn) && (
    <div className="leg-summary enhanced return-leg-display">
      🔄 <strong>{legs[legs.length - 1].distance}km</strong> | 
      ⏱️ <strong>{legs[legs.length - 1].duration}</strong> | 
      🚗 <span className={`mode-tag ${getEcoClass(returnMode)}`}>{returnMode}</span>
      <div className="leg-from">
        {legs[legs.length - 1].from} → {legs[legs.length - 1].to}
      </div>
    </div>
  )}
</div>

    

    <button className="calculate-btn" onClick={calculateRoute}>
      🧮 Calculate Complete Route
    </button>

    {/* Green Summary */}
    {routeSummary && (
      <div className="route-summary-green">
        <h4>✅ ROUTE CONFIRMED</h4>
        <div className="legs-list">
          {routeSummary.legs.map((leg, index) => leg && (
            <div key={index} className={`leg-item ${leg.isReturn ? 'return-leg' : ''}`}>
              <span className="leg-icon">
                {leg.mode === "Walking" && "🚶‍♂️"}
                {leg.mode === "Cycling" && "🚴‍♂️"}
                {leg.mode === "Car" && "🚗"}
                {leg.mode === "Train" && "🚆"}
                {leg.mode === "Flight" && "✈️"}
                {leg.isReturn && "🔄"}
              </span>
              <span className="leg-path">{leg.from} → {leg.to}</span>
              <span className="leg-details">{leg.distance}km | {leg.duration}</span>
              <span className={`leg-mode ${getEcoClass(leg.mode)}`}>{leg.mode}</span>
            </div>
          ))}
        </div>
        <div className="total-breakdown">
          <div className="total-row"><span>📏 Total Distance:</span><strong>{routeSummary.totalDistance}km</strong></div>
          <div className="total-row"><span>⏱️ Travel Time:</span><strong>{routeSummary.totalTravel}</strong></div>
          <div className="total-row"><span>👓 Sightseeing:</span><strong>{routeSummary.sightseeingHours.toFixed(1)}hr</strong></div>
          <div className="total-row"><span>🍽️ Meals/Rest:</span><strong>{routeSummary.bufferHours.toFixed(0)}hr</strong></div>
          <div className="total-row highlight">
            <span>📅 Total Duration:</span>
            <strong>{(routeSummary.totalTravelHours + routeSummary.sightseeingHours + routeSummary.bufferHours).toFixed(1)}hr</strong>
            <span>({routeSummary.totalDays} days)</span>
          </div>
        </div>
      </div>
    )}

    {distance && !routeSummary && (
      <>
        <div className="route-summary">
          <div><strong>{distance} km</strong><span>Total Distance</span></div>
          <div><strong>{duration}</strong><span>Travel Time</span></div>
        </div>
        <div className="days-summary">
          <h3>📅 Trip Duration</h3>
          <div className="days-breakdown">
            <div className="days-item"><strong>{calculateTotalDays()}</strong><span>Total Days</span></div>
            <div className="days-item"><strong>{parseDurationString(duration).toFixed(1)}hr</strong><span>Travel</span></div>
            <div className="days-item"><strong>{selectedPlaces.reduce((t, p) => t + (p.customDuration || p.defaultDuration), 0).toFixed(1)}hr</strong><span>Sightseeing</span></div>
            <div className="days-item"><strong>{(calculateTotalDays() * 3).toFixed(0)}hr</strong><span>Meals/Rest Buffer</span></div>
          </div>
        </div>
      </>
    )}

    <button className="save-btn" onClick={handleSave}>💾 Save Itinerary</button>
    <footer className="footer">
  <div className="footer-content">
    <p>&copy; 2026 EcoTravel. All rights reserved.</p>
    <p>Developed by: Nandhana • Monisha • Sindhuja</p>
  </div>
</footer>

  </div>
);

}
