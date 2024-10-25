import React, { useState, useEffect } from "react";
import "../App.css";
import { API_KEY } from "../utils/constants";

export default function WeatherInfo(props) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}&units=metric`;
  const [Wind_speed, setWindSpeed] = useState(0);
  const [Humidity, setHumidity] = useState(0);
  const [Visibility, setVisibility] = useState(0);
  const [Sunrise, setSunrise] = useState("6:00 AM");
  const [Sunset, setSunset] = useState("6:00 PM");
  const [pressure, setPressure] = useState(0);
  const [wind_dirn, setWindDirn] = useState("W");

  // Function to convert wind direction in degrees to cardinal direction
  const degreeToDirection = (degree) => {
    if (degree > 337.5) return "N";
    if (degree > 292.5) return "NW";
    if (degree > 247.5) return "W";
    if (degree > 202.5) return "SW";
    if (degree > 157.5) return "S";
    if (degree > 122.5) return "SE";
    if (degree > 67.5) return "E";
    if (degree > 22.5) return "NE";
    return "N";
  };

  // Function to convert UTC time to local time string
  const UTC_to_time_string = (UTC) => {
    const date = new Date(UTC * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const current = data.main;
        const astro = data.sys;
        const wind = data.wind;
        setWindSpeed((wind.speed * 3.6).toFixed(2));
        setHumidity(current.humidity);
        setVisibility((data.visibility / 1000).toFixed(1));
        setPressure((0.1 * current.pressure).toFixed(2));
        setWindDirn(degreeToDirection(wind.deg));
        setSunrise(UTC_to_time_string(astro.sunrise));
        setSunset(UTC_to_time_string(astro.sunset));
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [url]);

  return (
    <div className="weather-info-row">
      <div className="weather-item">
        <span className="label">Humidity</span>
        <span className="value">{Humidity} %</span>
      </div>
      <div className="weather-item">
        <span className="label">Visibility</span>
        <span className="value">{Visibility} Km</span>
      </div>
      <div className="weather-item">
        <span className="label">Wind</span>
        <span className="value">
          {Wind_speed} Km/hr {wind_dirn}
        </span>
      </div>
      <div className="weather-item">
        <span className="label">Pressure</span>
        <span className="value">{pressure} kPa</span>
      </div>
      <div className="weather-item">
        <span className="label">Sunrise</span>
        <span className="value">{Sunrise}</span>
      </div>
      <div className="weather-item">
        <span className="label">Sunset</span>
        <span className="value">{Sunset}</span>
      </div>
    </div>
  );
}
