import React, { useEffect, useState } from "react";
import { API_KEY } from "../utils/constants";
import "../App.css";

function WeatherAlert(props) {
  const [forecastData, setForecastData] = useState([]);
  const [upperTempThreshold, setUpperTempThreshold] = useState(35);
  const [lowerTempThreshold, setLowerTempThreshold] = useState(0);
  const [rainThreshold, setRainThreshold] = useState(3); // days of continuous rain
  const [alerts, setAlerts] = useState([]);
  const [rangeError, setRangeError] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}&units=metric`;

  // Fetch data from API
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data.list);
      })
      .catch((error) => console.log("Error:", error));
  }, [url]);

  // Validate temperature range
  useEffect(() => {
    if (lowerTempThreshold >= upperTempThreshold) {
      setRangeError(
        "Lower temperature threshold cannot be greater than or equal to the upper threshold."
      );
    } else {
      setRangeError("");
    }
  }, [lowerTempThreshold, upperTempThreshold]);

  // Check for weather alerts
  useEffect(() => {
    if (!forecastData || rangeError) return;

    let highTempDays = 0;
    let lowTempDays = 0;
    let rainyDays = 0;

    // Roll up data by day to check conditions
    const dailyData = forecastData.reduce((days, entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!days[date]) {
        days[date] = { temps: [], rainCount: 0, totalEntries: 0, rain: false };
      }

      const dayData = days[date];
      dayData.temps.push(entry.main.temp);
      dayData.totalEntries++;

      // Check if the weather condition is rain, thunderstorm, or drizzle
      const condition = entry.weather[0].main;
      if (["Rain", "Thunderstorm", "Drizzle"].includes(condition)) {
        dayData.rainCount++;
      }

      return days;
    }, {});

    // Evaluate thresholds
    Object.values(dailyData).forEach((day) => {
      // calculate average temperature for the day
      const avgTemp =
        day.temps.reduce((sum, t) => sum + t, 0) / day.temps.length;

      // Check upper temperature threshold for continuous days
      if (avgTemp > upperTempThreshold) {
        highTempDays++;
      } else {
        highTempDays = 0; // reset count if not continuous
      }

      // Check lower temperature threshold for continuous days
      if (avgTemp < lowerTempThreshold) {
        lowTempDays++;
      } else {
        lowTempDays = 0; // reset count if not continuous
      }

      // Check if rain occurred for more than 30% of the time in a day
      const rainPercentage = (day.rainCount / day.totalEntries) * 100;
      day.rain = rainPercentage > 30;

      // Count continuous rainy days
      if (day.rain) {
        rainyDays++;
      } else {
        rainyDays = 0; // reset count if not continuous
      }
    });

    // Set alerts based on thresholds
    const activeAlerts = [];
    if (highTempDays >= 2) {
      activeAlerts.push(
        `Heat Alert: Temperature above ${upperTempThreshold}°C for ${highTempDays} continuous days.`
      );
    }
    if (lowTempDays >= 2) {
      activeAlerts.push(
        `Cold Alert: Temperature below ${lowerTempThreshold}°C for ${lowTempDays} continuous days.`
      );
    }
    if (rainyDays >= rainThreshold) {
      activeAlerts.push(
        `Rain Alert: Rain expected for ${rainyDays} continuous days.`
      );
    }

    setAlerts(activeAlerts);
  }, [
    forecastData,
    upperTempThreshold,
    lowerTempThreshold,
    rainThreshold,
    rangeError,
  ]);

  return (
    <div className="weather-alert-container">
      <h3 className="alert-heading">Weather Alert Settings</h3>
      <div className="threshold-inputs">
        <div className="input-group">
          <label>Upper Temperature Threshold (°C):</label>
          <input
            type="number"
            value={upperTempThreshold}
            onChange={(e) =>
              setUpperTempThreshold(parseInt(e.target.value, 10))
            }
          />
        </div>
        <div className="input-group">
          <label>Lower Temperature Threshold (°C):</label>
          <input
            type="number"
            value={lowerTempThreshold}
            onChange={(e) =>
              setLowerTempThreshold(parseInt(e.target.value, 10))
            }
          />
        </div>
        <div className="input-group">
          <label>Continuous Rain Threshold (days):</label>
          <input
            type="number"
            value={rainThreshold}
            onChange={(e) => setRainThreshold(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
      {rangeError && <p className="error-message">{rangeError}</p>}
      {alerts.length > 0 && (
        <div className="alert-messages">
          {alerts.map((alert, index) => (
            <p key={index}>{alert}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherAlert;
