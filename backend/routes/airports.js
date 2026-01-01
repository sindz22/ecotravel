import express from "express";

const router = express.Router();

router.post("/airports", async (req, res) => {
  try {
    const { lat, lon } = req.body;
    console.log("🛫 Airport check:", lat.toFixed(2), lon.toFixed(2));

    // Simple distance check from major airports (real impl would use Overpass)
    const majorAirports = [
      { lat: 12.97, lon: 77.59 }, // Bengaluru
      { lat: 19.09, lon: 72.87 }, // Mumbai
      { lat: 28.57, lon: 77.10 }  // Delhi
    ];

    const hasAirport = majorAirports.some(airport => 
      Math.hypot(airport.lat - lat, airport.lon - lon) < 0.5
    );

    res.json({
      elements: hasAirport ? [{ id: 1, tags: { aeroway: "aerodrome" } }] : []
    });
  } catch (err) {
    console.error("❌ Airports error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
