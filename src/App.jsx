import React, { useState, useEffect } from 'react';
import {
  getCoordinates,
  getCurrentWeather,
  getForecastAndHistorical,
  getMarineWeather
} from './services/weatherService';

import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import Dashboard from './views/Dashboard';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // Default to London, or let user search immediately
  useEffect(() => {
    handleSearch('London');
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get Coordinates using Open-Meteo Geocoding
      const location = await getCoordinates(query);
      const { latitude: lat, longitude: lon, name, country } = location;

      // 2. Fetch all data in parallel
      const [current, advanced, marine] = await Promise.all([
        getCurrentWeather(query),  // From Weatherstack
        getForecastAndHistorical(lat, lon), // From Open-Meteo
        getMarineWeather(lat, lon) // From Open-Meteo
      ]);

      setWeatherData({
        location: { name, country, lat, lon },
        current: current.current,
        forecast: advanced.daily,
        hourly: advanced.hourly,
        marine: marine.hourly,
      });

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <nav className="glass-panel navbar">
        <div className="logo">
          <div className="logo-icon"></div>
          <h2>Weather<span>Stack</span></h2>
        </div>
        <div className="nav-search">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="nav-profile">
          <div className="avatar"></div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {loading && <Loader fullScreen={!weatherData} />}

        {error && (
          <div className="error-banner glass-panel">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {weatherData && !loading && (
          <Dashboard data={weatherData} />
        )}
      </main>
    </div>
  );
}

export default App;
