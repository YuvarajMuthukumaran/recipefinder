import React, { useState, useEffect } from "react";
import ParticlesBg from "./ParticlesBg";
import SearchAndDashboard from "./SearchAndDashboard";
import AuthPage from "./AuthPage";
import AboutDev from './AboutDev';
import Header from "./Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // Load logged-in user from localStorage (if any)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // When user logs out (optional)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <ParticlesBg />
      <Router>
        <Header user={user} logout={logout} />
        <Routes>
          <Route
            path="/"
            element={<SearchAndDashboard user={user} />}
          />
          <Route
            path="/AuthPage"
            element={<AuthPage onLogin={setUser} />}
          />
          <Route path="/AboutDev" element={<AboutDev />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
