import React from "react";
import "../App.css";
import sunny from "../assests/weatherIcons/sun.png";
import sunnyBG from "../assests/weatherIcons/Daybg.avif";
import nightBG from "../assests/weatherIcons/M-Maggs-pixabay.jpg";
import { useState } from "react";
import { API_KEY } from "../utils/constants";
export default function Weather(props) {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}`;
  const [temp, setTemp] = useState("");

  const [status, setStatus] = useState("");
  const [CityName, SetCityName] = useState(props.cityName + "," + props.state);
  const [CountryName, setCountryName] = useState("");
  const [AirQuality, setAirQuality] = useState("GOOD");
  const [WindSpeed, setWindSpped] = useState("32 Km/h");
  const [image, setImage] = useState(sunny);
  const [imageBG, setImageBG] = useState(sunnyBG);
  const [my_color, setMyColor] = useState("black");
  const [image_code, setImageCode] = useState("01d");
  const [feelsLike, setFeelsLike] = useState("");
  const currentDate = new Date();

  const options1 = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  };
  const options2 = {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  };
  // Functions to convert temperature and speed units
  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };
  const kelvinToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * (9 / 5) + 32).toFixed(1);
  };
  const MpsToKmph = (mps) => {
    return (mps * 3.6).toFixed(2);
  };
  const CurrentTime = new Intl.DateTimeFormat("en-US", options1).format(
    currentDate
  );
  const CurrentDate = new Intl.DateTimeFormat("en-US", options2).format(
    currentDate
  );

  const [localTime, setLocalTime] = useState(CurrentTime);
  const [LocalDate, setLocalDate] = useState(CurrentDate);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const current = data.main;
      const weather = data.weather[0];
      const wind = data.wind;
      const sunrise = data.sys.sunrise;
      const sunset = data.sys.sunset;
      SetCityName(props.cityName + "," + props.state);
      setTemp(current.temp);
      setFeelsLike(current.feels_like);
      setCountryName(props.country);
      setStatus(weather.description);
      setImageCode(weather.icon);
      setWindSpped(MpsToKmph(wind.speed));

      const local_time = data.dt;
      const time_zone_offset = data.timezone; // Offset in seconds from UTC

      // Create Date object and apply the offset
      const dateTime = new Date((local_time + time_zone_offset) * 1000);

      setLocalDate(new Intl.DateTimeFormat("en-US", options2).format(dateTime));
      setLocalTime(new Intl.DateTimeFormat("en-US", options1).format(dateTime));

      //logic for day or night
      if (local_time >= sunrise && local_time < sunset) {
        setImageBG(sunnyBG);
        setMyColor("black");
      } else if (local_time >= sunset || local_time < sunrise) {
        setImageBG(nightBG);
        setMyColor("white");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });

  const imageStyle = {
    backgroundImage: `url(${imageBG})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    color: `${my_color}`,
  };
  return (
    <div className="card" style={imageStyle}>
      <div className="card-body">
        <h5 className="card-title">
          {CityName},{CountryName}
        </h5>
        <p className="card-text Mytemperature">
          {props.temp === "C"
            ? kelvinToCelsius(temp)
            : kelvinToFahrenheit(temp)}
          {props.temp === "C" ? <sup>&deg;c</sup> : <sup>&deg;F</sup>}
          <img
            className="WeatherIcon"
            src={`https://openweathermap.org/img/wn/${image_code}@2x.png`}
            alt=""
          />
        </p>
        <p className="card-text">
          Feels Like :{" "}
          {props.temp === "C"
            ? kelvinToCelsius(feelsLike)
            : kelvinToFahrenheit(feelsLike)}
          {props.temp === "C" ? <sup>&deg;c</sup> : <sup>&deg;F</sup>}
        </p>
        <p className="card-text">{status}</p>
        <p className="card-text">
          {LocalDate}, Local Time : {localTime}
        </p>
        <p className="card-text details">
          <span>Air-Quality : {AirQuality}</span>
          <span>Wind : {WindSpeed} Km/h</span>
        </p>
      </div>
    </div>
  );
}
