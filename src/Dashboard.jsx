import React, { useState } from "react";
import SearchBar from "./SearchAndDashboard";

export default function Dashboard() {
  const [dashboardItems, setDashboardItems] = useState([]);

  const handleAddItem = (item) => {
    // Prevent duplicates
    if (!dashboardItems.includes(item)) {
      setDashboardItems((prev) => [...prev, item]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fridge Dashboard</h1>
      <SearchBar onItemSelect={handleAddItem} />

      <div style={{
        marginTop: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "10px 15px",
              background: "#f5f5f5",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
