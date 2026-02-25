import React, { useState, useEffect } from 'react';
import {
  getCoordinates,
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
      const [advanced, marine] = await Promise.all([
        getForecastAndHistorical(lat, lon), // From Open-Meteo
        getMarineWeather(lat, lon) // From Open-Meteo
      ]);

      // 3. Map Open-Meteo data to replace the HTTP-only Weatherstack data
      const now = new Date();
      // Find the closest hourly index for current humidity
      const currentHourlyIndex = advanced.hourly.time.findIndex(t => new Date(t) > now) || 0;

      const current = {
        temperature: advanced.current_weather.temperature,
        wind_speed: advanced.current_weather.windspeed,
        wind_dir: advanced.current_weather.winddirection,
        humidity: advanced.hourly.relative_humidity_2m[Math.max(0, currentHourlyIndex - 1)],
        precip: advanced.daily.precipitation_sum[7] || 0 // Today's precip sum
      };

      setWeatherData({
        location: { name, country, lat, lon },
        current: current,
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
