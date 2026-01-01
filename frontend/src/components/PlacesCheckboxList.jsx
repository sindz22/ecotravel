import "./PlacesCheckboxList.css";  // ✅ Add this line

export default function PlacesCheckboxList({ places, selectedPlaces, onToggle, onDurationChange }) {
  if (!places || places.length === 0) {
    return <p>No nearby places found.</p>;
  }

  return (
    <div className="places-checkbox-list">
      {places.map((place) => {
        const isSelected = selectedPlaces.some((p) => p.id === place.id);
        const duration = place.customDuration || place.defaultDuration || 1.5;
        
        return (
          <label key={place.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(place)}
            />
            <div className="place-info">
              <span className="place-name">{place.name || "Unnamed place"}</span>
              {place.category && (
                <span className="place-category">{place.category}</span>
              )}
              
              {/* ✅ DURATION EDITOR (only when selected) */}
              {isSelected && (
                <div className="duration-editor">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="8"
                    value={duration.toFixed(1)}
                    onChange={(e) => {
                      const newDuration = Number(e.target.value);
                      if (onDurationChange) {
                        onDurationChange(place.id, newDuration);
                      }
                    }}
                    className="place-duration"
                    title={`Duration: ${duration.toFixed(1)}hr (Zoo:3.5hr, Lunch:1hr, Park:1.25hr)`}
                  />
                  <span className="duration-label">hr</span>
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
