import React, { useState, useEffect } from "react";
import "./App.css";

import {
  BsSearch,
  BsLightbulbOff,
  BsLightbulb,
  BsFillTrashFill,
  BsFillBackspaceFill,
} from "react-icons/bs"; // Installed package for icons

const App = () => {
  const [theme, setTheme] = useState("light"); // Theme: light or dark
  const [city, setCity] = useState(""); // The value of input eg: Johor, Malaysia or Johor
  const [weatherData, setWeatherData] = useState(null); // Current weather information
  const [error, setError] = useState(null); // Calling APIs error if any
  const [searchHistory, setSearchHistory] = useState([]); // Search history list

  useEffect(() => {
    // Function: Get the current weather based on the device location
    const fetchWeatherData = async () => {
      try {
        const { coords } = await getCurrentLocation(); //Get coordinates

        // Fetch weather data from OpenWeather API
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${process.env.REACT_APP_WEATHER_APP_ID}&units=metric`;
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data = await response.json();
          setWeatherData(data); // Update state: weatherData
          setError(null);
        } else {
          throw new Error("City Not Found. Please Try Again."); // Error Message
        }
      } catch (err) {
        setError(err.message); // Update state: error
      }
    };

    fetchWeatherData();
  }, []);

  // Get the current location of the device
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  };

  // To change the theme (dark mode and light mode)
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light")); // Update state: theme
  };

  // To get the weather information from input (Call APIs)
  const getWeatherInfo = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_WEATHER_APP_ID}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        // New History Data
        const newData = [
          {
            city: data.name,
            country: data.sys.country,
            datetime: new Date(data.dt * 1000).toLocaleString(),
          },
        ];

        setSearchHistory((prevData) => [...prevData, ...newData]);
        setWeatherData(data);
        setError(null);
      } else {
        throw new Error("City Not Found. Please Try Again.");
      }
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    }
  };

  // To get the weather information from history (Call APIs)
  const searchAgain = async (index) => {
    try {
      const selectedData = searchHistory[index];
      const selectedCity = `${selectedData.city},${selectedData.country}`;

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${process.env.REACT_APP_WEATHER_APP_ID}&units=metric`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        const newData = [
          {
            city: data.name,
            country: data.sys.country,
            datetime: new Date(data.dt * 1000).toLocaleString(),
          },
        ];

        setSearchHistory((prevData) => [...prevData, ...newData]);
        setWeatherData(data);
        setError(null);
      } else {
        throw new Error("City Not Found. Please Try Again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // To delete the search history
  const handleRemove = (index) => {
    const newData = [...searchHistory];
    newData.splice(index, 1);
    setSearchHistory(newData);
  };

  return (
    <div className="app">
      <div className={`background-image-${theme}`} />

      <div className={`content-${theme}`}>
        <div className="header">
          <h1 className="header-text">Weather App</h1>
          {theme === "light" ? (
            <BsLightbulbOff
              className={`theme-icon-${theme}`}
              onClick={toggleTheme}
            />
          ) : (
            <BsLightbulb
              className={`theme-icon-${theme}`}
              onClick={toggleTheme}
            />
          )}
        </div>

        <div className="input-row">
          <div className="input-container">
            <input
              type="text"
              className={`city-input-${theme}`}
              placeholder="Enter City and Country Eg: Johor Bahru, Malaysia"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />
            <BsFillBackspaceFill
              className={`clear-icon-${theme}`}
              onClick={() => {
                setCity("");
              }}
            />
          </div>

          <div className={`search-box-${theme}`} onClick={getWeatherInfo}>
            <BsSearch className={`search-icon-${theme}`} />
          </div>
        </div>

        {weatherData && <div className="blank-space" />}

        <div className={`result-container-${theme}`}>
          {weatherData && weatherData.weather[0].main === "Clouds" && (
            <div className="image-container">
              <img src="/images/cloud.png" alt="Cloud Image" className="image" />
            </div>
          )}

          {weatherData && weatherData.weather[0].main !== "Clouds" && (
            <div className="image-container">
              <img src="/images/sun.png" alt="Sun Image" className="image" />
            </div>
          )}

          {error && <div className="blank-space">{error}</div>}

          {weatherData && (
            <div className="information-box">
              <div className="text-column-box">
                <a>Today's Weather</a>
                <a className={`current-temp-${theme}`}>
                  {weatherData.main.temp.toFixed(0)}°
                </a>
                <a>{weatherData.weather[0].description}</a>
                <a>
                  H: {weatherData.main.temp_max.toFixed(0)}° L:{" "}
                  {weatherData.main.temp_min.toFixed(0)}°{" "}
                </a>
                <b>
                  {weatherData.name}, {weatherData.sys.country}
                </b>
              </div>
              <div className="text-row">
                <a>{new Date(weatherData.dt * 1000).toLocaleString()}</a>
                <a>Humidity: {weatherData.main.humidity}%</a>
                <a>{weatherData.weather[0].main}</a>
              </div>
            </div>
          )}

          <a>Search History</a>
          <div className={`history-box-${theme}`}>
            {searchHistory.length == 0 && <a>No Record</a>}

            {searchHistory.map((item, index) => (
              <div key={index} className={`data-row-${theme}`}>
                <div className="list-column">
                  <span>
                    {item.city}, {item.country}
                  </span>
                  <span>{item.datetime}</span>
                </div>
                <div className="icon-row">
                  <div className="icon-circle" onClick={() => handleRemove(index)}>
                    <BsFillTrashFill className="list-icon" />
                  </div>
                  <div className="icon-circle" onClick={() => searchAgain(index)}>
                    <BsSearch className="list-icon" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
