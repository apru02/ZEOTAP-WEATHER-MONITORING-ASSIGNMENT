import React, { useEffect, useState } from "react";
import "../App.css";
import my_image from "../assests/weatherIcons/sun.png"; // Default fallback image
import { API_KEY } from "../utils/constants";

export default function Forecast(props) {
  const cnt = 5; // Number of forecast days
  const url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}&units=metric`;
  const [forecastData, setForecastData] = useState([]);

  // Helper function to aggregate data for each day
  const processDailyForecast = (data) => {
    const dailyData = {};

    data.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0]; // Get the date part of the timestamp
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          minTemp: entry.main.temp_min,
          maxTemp: entry.main.temp_max,
          conditions: {},
          icons: {},
        };
      }
      const dayData = dailyData[date];

      // Collect temperature data
      dayData.temps.push(entry.main.temp);
      dayData.minTemp = Math.min(dayData.minTemp, entry.main.temp_min);
      dayData.maxTemp = Math.max(dayData.maxTemp, entry.main.temp_max);

      // Collect weather conditions and icons
      const condition = entry.weather[0].description;
      const icon = entry.weather[0].icon;
      if (!dayData.conditions[condition]) {
        dayData.conditions[condition] = 0;
      }
      if (!dayData.icons[icon]) {
        dayData.icons[icon] = 0;
      }
      dayData.conditions[condition]++;
      dayData.icons[icon]++;
    });

    // Final aggregation
    return Object.keys(dailyData).map((date) => {
      const dayData = dailyData[date];
      const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;

      // Find the most frequent weather condition and icon
      const dominantCondition = Object.keys(dayData.conditions).reduce((a, b) =>
        dayData.conditions[a] > dayData.conditions[b] ? a : b
      );
      const dominantIcon = Object.keys(dayData.icons).reduce((a, b) =>
        dayData.icons[a] > dayData.icons[b] ? a : b
      );

      return {
        date,
        avgTemp: avgTemp.toFixed(1),
        minTemp: dayData.minTemp.toFixed(1),
        maxTemp: dayData.maxTemp.toFixed(1),
        dominantCondition,
        dominantIcon,
      };
    });
  };

  // Fetch data from API
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const processedData = processDailyForecast(data.list);
        setForecastData(processedData);
      })
      .catch((error) => console.log("Error:", error));
  }, [url]);

  return (
    <div className="card">
      <div className="card-body">
        <table>
          <thead>
            <tr>
              <th className="Wlabels"></th>
              {forecastData.map((day, index) => (
                <th className="forecast_day" key={index}>
                  {index === 0 ? "Today" : day.date.split("-").slice(1,3).reverse().join("/")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="Wlabels"></td>
              {forecastData.map((day, index) => (
                <td key={index}>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.dominantIcon}@2x.png`} // Use the most frequent icon
                    alt={day.dominantCondition}
                    className="for_image"
                  />
                </td>
              ))}
            </tr>
            <tr className="my_status">
              <td className="Wlabels">Condition</td>
              {forecastData.map((day, index) => (
                <td key={index} className="my_status">
                  {day.dominantCondition}
                </td>
              ))}
            </tr>
            <tr>
              <td className="Wlabels my_tags">Max Temperature</td>
              {forecastData.map((day, index) => (
                <td key={index}>{day.maxTemp}°C</td>
              ))}
            </tr>
            <tr>
              <td className="Wlabels my_tags">Min Temperature</td>
              {forecastData.map((day, index) => (
                <td key={index}>{day.minTemp}°C</td>
              ))}
            </tr>
            <tr>
              <td className="Wlabels my_tags">Avg Temperature</td>
              {forecastData.map((day, index) => (
                <td key={index}>{day.avgTemp}°C</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
