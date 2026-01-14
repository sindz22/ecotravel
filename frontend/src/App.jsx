import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainPage from "./pages/MainPage";
import PlanItinerary from "./pages/PlanItinerary";
import MyItineraries from "./pages/MyItineraries";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Instant scroll to top on route change
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run when pathname changes
  
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
    <scrollToTop/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/plan-itinerary/:id?" element={<PlanItinerary />} />
        <Route path="/my-itineraries" element={<MyItineraries />} />
      </Routes>
    </BrowserRouter>
  );
}
