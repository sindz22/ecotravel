import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/overpass", async (req, res) => {
  try {
    const { query } = req.body;
    console.log("🌍 Overpass query:", query.substring(0, 100) + "...");

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Overpass API error:", text);
      return res.status(500).json({ error: "Overpass request failed" });
    }

    const data = await response.json();
    console.log("✅ Overpass success:", data.elements?.length || 0, "places found");
    res.json(data);
  } catch (err) {
    console.error("❌ Overpass server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
