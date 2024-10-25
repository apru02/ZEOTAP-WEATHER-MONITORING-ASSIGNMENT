import React, { useState } from "react";
import "../App.css";
import { API_KEY } from "../utils/constants";

export default function Search({ on_search }) {
  const [myCity, setMyCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (event) => {
    setMyCity(event.target.value);
    const limit = 5;
    if (event.target.value.length > 2) {
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${event.target.value}&limit=${limit}&appid=${API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMyCity(suggestion.name);
    on_search(suggestion);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (suggestions.length > 0) {
      on_search(suggestions[0]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-container">
      <form
        className="d-flex"
        style={{ position: "relative",alignItems:"start",padding:"10px" }}
        onSubmit={handleSubmit}
      >
        <div style={{ display: "flex", flexDirection: "column",width:"45%" }}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search your City"
            aria-label="Search"
            style={{ width: "45%" }}
            value={myCity}
            onChange={handleInputChange}
          />
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}, {suggestion.state}, {suggestion.country}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}
