import { useState, useRef, useEffect } from "react";
import "./LocationSearch.css";  // ✅ REQUIRED!

export default function LocationSearch({ label, value, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);

  const fetchLocations = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(value)}&limit=6`
      );
      const data = await res.json();
      console.log("Nominatim results:", data);
      setResults(data);
    } catch (err) {
      console.error("Nominatim failed:", err);
      setResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSimpleName = (place) => {
    const addr = place.address || {};
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.state ||
      addr.country ||
      place.display_name?.split(",")[0] ||
      "Unknown"
    );
  };

  const handleSelect = (place) => {
    console.log("SELECT CLICKED:", place);
    const simpleName = getSimpleName(place);
    
    const lat = Number(place.lat);
    const lon = Number(place.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      console.warn("Invalid coordinates:", place.lat, place.lon);
      return;
    }
    
    if (onSelect) {
      onSelect({
        name: simpleName,
        lat,
        lon,
      });
    }
    setQuery(simpleName);
    setResults([]);
  };

  const clearSelection = () => {
    setQuery("");
    if (onSelect) onSelect(null);
  };

  // ✅ SAFE NUMBER CONVERSION HELPER
  const formatCoord = (coord) => {
    const num = Number(coord);
    return isNaN(num) ? 'N/A' : num.toFixed(4);
  };

  return (
    <div className="location-search" ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      {label && (
        <label 
          className="location-label" 
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#2c3e50",
            fontSize: "14px"
          }}
        >
          {label}
        </label>
      )}

      {/* ✅ SHOW LOADED VALUE OR INPUT */}
      <div style={{ position: "relative" }}>
        {value ? (
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              background: "#e8f5e8",
              border: "2px solid #4caf50",
              borderRadius: "8px",
              fontWeight: "500",
              color: "#2e7d32",
              fontSize: "16px",
              minHeight: "48px",
              gap: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onClick={() => setQuery(value.name)}
          >
            <span style={{ fontSize: "18px" }}>📍</span>
            <span style={{ flex: 1 }}>{value.name}</span>
            <span style={{ fontSize: "12px", opacity: 0.7 }}>
              {formatCoord(value.lat)}, {formatCoord(value.lon)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: "#ef5350",
                padding: "4px",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(239,83,80,0.1)"}
              onMouseLeave={(e) => e.target.style.background = "transparent"}
            >
              ✕
            </button>
          </div>
        ) : (
          <input
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "16px",
              background: "white",
              transition: "all 0.2s ease",
              outline: "none"
            }}
            value={query}
            onChange={(e) => fetchLocations(e.target.value)}
            placeholder="Search location..."
            onFocus={(e) => e.target.style.borderColor = "#4caf50"}
            onBlur={(e) => {
              setTimeout(() => {
                if (query.length < 3) setResults([]);
                e.target.style.borderColor = "#e0e0e0";
              }, 200);
            }}
          />
        )}
      </div>

      {/* ✅ RESULTS DROPDOWN */}
      {results.length > 0 && (
        <div 
          style={{
            position: "absolute",
            top: value ? "100%" : "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            zIndex: 1000,
            maxHeight: "240px",
            overflow: "auto",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            marginTop: "4px"
          }}
        >
          {results.map((place) => {
            const simpleName = getSimpleName(place);
            return (
              <button
                type="button"
                key={place.place_id}
                style={{
                  width: "100%",
                  border: "none",
                  background: "none",
                  padding: "14px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "15px",
                  transition: "all 0.2s ease",
                  borderBottom: "1px solid #f5f5f5"
                }}
                onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
                onClick={() => handleSelect(place)}
              >
                <span style={{ fontSize: "18px" }}>📍</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "500", color: "#2c3e50" }}>{simpleName}</div>
                  <div style={{ 
                    fontSize: "13px", 
                    color: "#7f8c8d", 
                    marginTop: "2px",
                    fontWeight: "400"
                  }}>
                    {formatCoord(place.lat)}, {formatCoord(place.lon)}
                  </div>
                </div>
              </button>
            );  
          })}
        </div>
      )}
    </div>
  );
}
