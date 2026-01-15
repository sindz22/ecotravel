export default function PlacesCheckboxList({ 
  places, 
  selectedPlaces, 
  onToggle, 
  onDurationChange 
}) {
  if (!places || places.length === 0) {
    return <p>No nearby places found.</p>;
  }

  return (
    <div className="places-checkbox-list">
      {places.map((place) => {
        // ✅ FIX: Find CURRENT place from selectedPlaces array
        const selectedPlace = selectedPlaces.find(p => p.id === place.id);
        const duration = selectedPlace?.customDuration || 
                        place.customDuration || 
                        place.defaultDuration || 1.5;
        
        const isSelected = !!selectedPlace;

        return (
          <label key={place.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(place)}
            />
            <div className="place-info">
              <span className="place-name">{place.name}</span>
              {place.category && (
                <span className="place-category">{place.category}</span>
              )}
              
              {/* ✅ FIXED: Uses selectedPlace duration */}
              {isSelected && (
                <div className="duration-editor">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="8"
                    value={duration.toFixed(1)}  // ✅ NOW UPDATES!
                    onChange={(e) => {
                      const newDuration = Number(e.target.value);
                      onDurationChange(place.id, newDuration);
                    }}
                    className="place-duration"
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
