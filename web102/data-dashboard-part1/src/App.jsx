// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiet, setFilterDiet] = useState("All");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=83a6d467050d4f17bbafac7204e6b48c&addRecipeInformation=true&number=20`
        );
        const data = await response.json();
        const mapped = (data.results || []).map((r) => ({
          id: r.id,
          title: r.title,
          image: r.image,
          type: r.dishTypes?.[0] || "Unknown",
          diet: r.diets?.[0] || "Unknown",
        }));
        setRecipes(mapped);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Filter logic (search by title, filter by diet)
  const filteredRecipes = recipes
    .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((r) => (filterDiet === "All" ? true : r.diet === filterDiet));

  // Dashboard statistics
  const totalRecipes = filteredRecipes.length;
  const uniqueTypes = [...new Set(recipes.map((r) => r.type))].filter(
    (t) => t !== "Unknown"
  ).length;
  const uniqueDiets = [...new Set(recipes.map((r) => r.diet))].filter(
    (d) => d !== "Unknown"
  ).length;

  return (
    <div className="app">
      <h1> Recipe Dash 🍽️ </h1>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterDiet}
          onChange={(e) => setFilterDiet(e.target.value)}
        >
          <option value="All">All Diets</option>
          {Array.from(new Set(recipes.map((r) => r.diet))).map((diet, index) => (
            <option key={index} value={diet}>
              {diet}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="stats">
        <p>Total Recipes Displayed: {totalRecipes}</p>
        <p>Unique Types: {uniqueTypes}</p>
        <p>Unique Diets: {uniqueDiets}</p>
      </div>

      {/* Dashboard Table (now renders every filtered item so count matches) */}
      <table className="dashboard">
        <thead>
          <tr>
            <th>Image</th>
            <th>Recipe Title</th>
            <th>Type</th>
            <th>Diet</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>
                <img src={recipe.image} alt={recipe.title} className="thumb" />
              </td>
              <td>{recipe.title}</td>
              <td>{recipe.type}</td>
              <td>{recipe.diet}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredRecipes.length === 0 && <p>No recipes found.</p>}
    </div>
  );
}

export default App;
