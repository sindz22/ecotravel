// backend/routeApi.js (Node/Express example)
import express from "express";
import fetch from "node-fetch";

const router = express.Router();
const ORS_API_KEY = process.env.ORS_API_KEY; // put your key in .env

router.post("/route", async (req, res) => {
  try {
    const { start, end, profile } = req.body;

    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
      {
        method: "POST",
        headers: {
          "Authorization": ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [start.lon, start.lat],
            [end.lon, end.lat],
          ],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("ORS error:", text);
      return res.status(500).json({ error: "ORS request failed" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
