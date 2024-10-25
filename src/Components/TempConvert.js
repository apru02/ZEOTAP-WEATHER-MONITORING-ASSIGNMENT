import React from "react";
import "../App.css"; // Import the custom CSS for styling

function TempConvert(props) {
  const handleChange = (e) => {
    props.handleTempChange(e.target.value);
  };

  return (
    <div className="temp-convert">
      {/* A temperature converter input for Celsius or Fahrenheit */}
      <div className="form-check">
        <input
          type="radio"
          name="temperature"
          id="celsiusOption"
          value="C"
          checked={props.temp === "C"}
          onChange={handleChange}
          className="radio-input"
        />
        <label
          htmlFor="celsiusOption"
          className={`temp-label ${props.temp === "C" ? "active" : ""}`}
        >
          Celsius
        </label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          name="temperature"
          id="fahrenheitOption"
          value="F"
          checked={props.temp === "F"}
          onChange={handleChange}
          className="radio-input"
        />
        <label
          htmlFor="fahrenheitOption"
          className={`temp-label ${props.temp === "F" ? "active" : ""}`}
        >
          Fahrenheit
        </label>
      </div>
    </div>
  );
}

export default TempConvert;
