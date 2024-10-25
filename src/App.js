import "./App.css";
import Forecast from "./Components/Forecast";
import Navbar from "./Components/Navbar";
import Search from "./Components/Search";
import TempConvert from "./Components/TempConvert";
import Weather from "./Components/Weather";
import WeatherAlert from "./Components/WeatherAlert";
import WeatherInfo from "./Components/WeatherInfo";
import React, { useEffect, useState } from "react";
import { API_KEY } from "./utils/constants";
function App() {
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const onsearch = (data) => {
    setCity(data?.name);
    setLat(data?.lat);
    setLon(data?.lon);
    setState(data?.state);
    setCountry(data?.country);
  };
  const handleTempChange = (temp) => {
    setTemp(temp);
  };
  const [temp, setTemp] = useState("C");

  const getGeoInfo = (lattitude, longitude) => {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lattitude}&lon=${longitude}&limit=${5}&appid=${API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const city = data[0];
        setCity(city.name);
        setState(city?.state);
        setCountry(city.country);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      getGeoInfo(position.coords.latitude, position.coords.longitude);
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
      // setCity(`${position.coords.latitude} ${position.coords.longitude}`);
    });
    return () => {};
  }, []);

  return (
    <>
      <Navbar />
      <Search on_search={onsearch} />
      <WeatherInfo lat={lat} lon={lon} />
      <div className="Mycontainer" style={{ width: "100%" }}>
        <div className="myCol" style={{ width: "30%" }}>
          <TempConvert temp={temp} handleTempChange={handleTempChange} />
          <WeatherAlert lat={lat} lon={lon} />
        </div>
        <div
          className="myCol"
          style={{ width: "60%", flexDirection: "row", marginTop: 0 }}
        >
          <Weather
            cityName={city}
            state={state}
            country={country}
            lat={lat}
            lon={lon}
            temp={temp}
          />
          <Forecast
            cityName={city}
            state={state}
            country={country}
            lat={lat}
            lon={lon}
            temp={temp}
          />
        </div>
      </div>
    </>
  );
}

export default App;
