import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import API_BASE_URL from "../config";  // ← ADD THIS LINE at top


export default function Signup() {
  useEffect(() => {
      document.title = 'EcoTravel | Signup';
    }, []);
  const navigate = useNavigate();

    const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    travelPreferences: [],
    travelFrequency: "",
    ecoLevel: "",
    mobilityPreferences: [],
    accommodationPreferences: [],
    diet: "",
    allergies: ""
  });

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- HANDLE CHECKBOX GROUPS ----------------
  const handleCheckbox = (e, field) => {
    const value = e.target.value;

    setForm((prev) => {
      const updated = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];

      return { ...prev, [field]: updated };
    });
  };

  // ---------------- RADIO HANDLER ----------------
  const handleRadio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (res.status === 201) {
        localStorage.setItem("flash", result.message);
        navigate("/login");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div>
        <header className="site-header">
    <div className="logo">
      <div className="brand">EcoTravel</div>
      <div className="tagline">Sustainable Travel Planner</div>
    </div>
        <div className="auth">
          <button
    className="btn btn-primary"
    onClick={() => navigate('/')}

  >
    Home
  </button>
      <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
    </div>
  </header>
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create Account</h2>

        <label>Name</label>
        <input type="text" placeholder="Enter your full name" name="name" value={form.name} onChange={handleChange}/>

        <label>Email</label>
        <input type="email" placeholder="Enter your email" name="email" value={form.email} onChange={handleChange}/>

        <label>Password</label>
        <input type="password" placeholder="Enter password" name="password" value={form.password} onChange={handleChange}/>

        <label>Confirm Password</label>
        <input type="password" placeholder="Re-enter password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}/>

<div className="form-group">
  <label>Date of Birth</label>
  <input type="date" name="dob" value={form.dob} onChange={handleChange}/>
</div>

        <h3>Travel Preferences</h3>
        <div className="check-group">
            {["Nature","Adventure","Culture","Relaxation","Food","Budget Trips"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={form.travelPreferences.includes(item)}
                  onChange={(e) => handleCheckbox(e, "travelPreferences")}
                />
                {item}
              </label>
            ))}
          </div>
          
        <h3>Travel Frequency</h3>
        <div className="radio-group">
            {["Monthly", "Once in 6 months", "Yearly", "Rarely"].map((f) => (
              <label key={f}>
                <input
                  type="radio"
                  name="travelFrequency"
                  value={f}
                  onChange={handleRadio}
                />
                {f}
              </label>
            ))}
          </div>

        <h3>Eco-Responsibility Level</h3>
        <div className="radio-group">
            {["Beginner", "Moderate", "Serious"].map((level) => (
              <label key={level}>
                <input
                  type="radio"
                  name="ecoLevel"
                  value={level}
                  onChange={handleRadio}
                />
                {level}
              </label>
            ))}
          </div>

        <h3>Mobility Preferences</h3>
        <div className="check-group">
            {["Walking","Cycling","Public Transport","Electric Vehicle","Car-free Travel"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={form.mobilityPreferences.includes(item)}
                  onChange={(e) => handleCheckbox(e, "mobilityPreferences")}
                />
                {item}
              </label>
            ))}
          </div>

        <h3>Accommodation Preference</h3>
        <div className="check-group">
            {["Eco-stays","Hostels","Hotels","Camping","Homestays"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={form.accommodationPreferences.includes(item)}
                  onChange={(e) =>
                    handleCheckbox(e, "accommodationPreferences")
                  }
                />
                {item}
              </label>
            ))}
          </div>

        <h3>Dietary Preference</h3>
        <div className="radio-group">
            {["Veg","Vegan","Eggetarian","No Preference"].map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  name="diet"
                  value={d}
                  onChange={handleRadio}
                />
                {d}
              </label>
            ))}
          </div>

        <label>Allergies (optional)</label>
        <input
            type="text"
            name="allergies"
            placeholder="Enter allergies"
            value={form.allergies}
            onChange={handleChange}
          />

        <button onClick={handleSubmit}>Create Account</button>

        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
    <footer className="footer">
  <div className="footer-content">
    <p>&copy; 2026 EcoTravel. All rights reserved.</p>
    <p>Developed by: Nandhana • Monisha • Sindhuja</p>
  </div>
</footer>

    </div>
  );
}
