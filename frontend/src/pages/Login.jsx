import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API_BASE_URL from "../../config";  // Adjust path: ../config or ../../config


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [flashMsg, setFlashMsg] = useState("");

  // ---------------- FLASH MESSAGE ----------------
  useEffect(() => {
    const msg = localStorage.getItem("flash");
    if (msg) {
      setFlashMsg(msg);
      localStorage.removeItem("flash"); // show once
    }
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  setMsg(data.message);

  if (res.status === 200) {
    localStorage.setItem('token', data.token);  // ✅ SAVE TOKEN
    console.log('✅ Token saved!');
    setTimeout(() => navigate("/main"), 1500);      // ✅ MAIN PAGE
  }
};

  return (
    <div >
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
      <button className="btn btn-primary" onClick={() => navigate("/signup")}>Signup</button>
    </div>
  </header>
  <div class="login-container">
    {/* ===================== MAIN LOGIN BOX ===================== */}
   {/* FLASH MESSAGE */}
        {flashMsg && <div className="flash-success">{flashMsg}</div>}
        {msg && <div className="flash-error">{msg}</div>}


      <div className="login-form">
        <h2>Login</h2>

        <label>Email</label>
        <input 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        <label>Password</label>
        <input 
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have an account?{" "}
          <a onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>
            Signup
          </a>
        </p>
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

