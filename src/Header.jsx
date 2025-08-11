import React from "react"; 
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ user, logout }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <nav className="nav" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <h1 className="title" style={{ flexGrow: 1, textAlign: "center" }}>Recipe Finder</h1>
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>{user.name}</span>

            <button
              onClick={() => navigate("/AboutDev")}
              style={{
                cursor: "pointer",
                backgroundColor: "#1976d2",    // Blue color
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "600",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "background-color 0.3s ease",
                marginRight: "10px"
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = "#115293")} // Darker blue hover
              onMouseLeave={e => (e.target.style.backgroundColor = "#1976d2")}
            >
              About Dev
            </button>

            <button
              onClick={logout}
              style={{
                cursor: "pointer",
                backgroundColor: "#f44336",    // Red color
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "600",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = "#d32f2f")} // Darker red hover
              onMouseLeave={e => (e.target.style.backgroundColor = "#f44336")}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/AuthPage" className="nav-link">
            Login/Signup
          </Link>
        )}
      </nav>
    </header>
  );
}
