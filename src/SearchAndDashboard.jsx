import React, { useState, useEffect } from "react";

const API_KEY = "1a04baf48314428e9fb7d8c8066bf79a";

export default function SearchAndDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dashboardItems, setDashboardItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);

  // Get logged user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Fetch dashboard items on mount
  useEffect(() => {
    if (!userId) return;
    const fetchItems = async () => {
      try {
        const res = await fetch(`https://recipefinder-m7qk.onrender.com/dashboard-items/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch dashboard items");
        const data = await res.json();
        setDashboardItems(data.dashboardItems || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [userId]);

  // Save dashboard items on change with debounce
  useEffect(() => {
    if (!userId) return;
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://recipefinder-m7qk.onrender.com/dashboard-items/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dashboardItems }),
        });
        if (!res.ok) throw new Error("Failed to save dashboard items");
      } catch (err) {
        console.error(err);
      }
    }, 1000); // 1 sec debounce

    return () => clearTimeout(timeout);
  }, [dashboardItems, userId]);

  // Fetch ingredients for search suggestions
  const fetchIngredients = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&number=10&apiKey=${API_KEY}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItemToDashboard = (item) => {
    if (!dashboardItems.find((i) => i.name === item.name)) {
      setDashboardItems([...dashboardItems, item]);
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const removeItemFromDashboard = (name) => {
    setDashboardItems(dashboardItems.filter((item) => item.name !== name));
  };

  // Fetch recipes based on dashboard items
  useEffect(() => {
    if (dashboardItems.length === 0) {
      setRecipes([]);
      return;
    }
    const fetchRecipes = async () => {
      try {
        const ingredientList = dashboardItems.map((i) => i.name).join(",");
        const res = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=10&apiKey=${API_KEY}`
        );
        const data = await res.json();
        setRecipes(data.filter((r) => r.missedIngredientCount <= 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, [dashboardItems]);

  // Fetch recipe details when selected
  useEffect(() => {
    if (!selectedRecipe) {
      setRecipeDetails(null);
      return;
    }
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${selectedRecipe.id}/information?includeNutrition=false&apiKey=${API_KEY}`
        );
        const data = await res.json();
        setRecipeDetails(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [selectedRecipe]);

  const closeModal = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2>🍳 Ingredient Search & Dashboard</h2>

      <input
        type="text"
        value={searchTerm}
        placeholder="Search for ingredients..."
        onChange={(e) => {
          setSearchTerm(e.target.value);
          fetchIngredients(e.target.value);
        }}
        style={{ padding: 10, width: "100%", borderRadius: 5, border: "1px solid #ccc", marginBottom: 10 }}
      />

      {searchResults.length > 0 && (
        <div style={{ border: "1px solid #ccc", borderRadius: 5, background: "#fafafa" }}>
          {searchResults.map((item) => (
            <div
              key={item.name}
              onClick={() => addItemToDashboard(item)}
              style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 20 }}>📌 Dashboard Items</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {dashboardItems.map((item) => (
          <div
            key={item.name}
            style={{
              padding: "8px 12px",
              background: "#e3f2fd",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {item.name}
            <button
              onClick={() => removeItemFromDashboard(item.name)}
              style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: "bold", color: "#d32f2f" }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {recipes.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>🍽 Recipe Suggestions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                style={{
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 5,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <img src={recipe.image} alt={recipe.title} style={{ width: "100%", borderRadius: 5 }} />
                <p style={{ margin: "5px 0", fontWeight: "bold" }}>{recipe.title}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedRecipe && recipeDetails && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflowY: "auto",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 20,
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                float: "right",
                fontSize: 20,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#d32f2f",
              }}
              aria-label="Close modal"
            >
              ✖
            </button>

            <h2>{recipeDetails.title}</h2>
            <img
              src={recipeDetails.image}
              alt={recipeDetails.title}
              style={{ width: "100%", borderRadius: 10, marginBottom: 10 }}
            />
            <div dangerouslySetInnerHTML={{ __html: recipeDetails.summary }} style={{ marginBottom: 15 }} />

            <h3>🥦 Ingredients</h3>
            <ul>
              {recipeDetails.extendedIngredients.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>

            <h3>🍳 Instructions</h3>
            {recipeDetails.analyzedInstructions.length > 0 ? (
              <ol>
                {recipeDetails.analyzedInstructions[0].steps.map((step) => (
                  <li key={step.number}>{step.step}</li>
                ))}
              </ol>
            ) : (
              <p>No instructions available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
