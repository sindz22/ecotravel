const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  startLocation: Object,
  stops: [Object],
  legModes: [String],
  returnDestination: String,
  returnMode: String,
  selectedPlaces: [Object],
  totalDistance: Number,
  totalDuration: String,
  totalDays: Number,
  routeSummary: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
