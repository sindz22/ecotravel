import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainPage from "./pages/MainPage";
import PlanItinerary from "./pages/PlanItinerary";
import MyItineraries from "./pages/MyItineraries";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/plan-itinerary/:id?" element={<PlanItinerary />} />
        <Route path="/my-itineraries" element={<MyItineraries />} />
      </Routes>
    </Router>
  );
}
