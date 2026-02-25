import axios from 'axios';

// Base URL configuration for Weatherstack and Open-Meteo
const WEATHERSTACK_BASE_URL = 'http://api.weatherstack.com';
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

// We get Current from Weatherstack as requested
export const getCurrentWeather = async (query) => {
    try {
        const response = await axios.get(`${WEATHERSTACK_BASE_URL}/current`, {
            params: {
                access_key: '9c0af684484c407a9e995452262502',
                query,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching current weather from Weatherstack", error);
        throw error;
    }
};

// Use Open-Meteo Geocoding to get lat/lon for city names
export const getCoordinates = async (query) => {
    try {
        const response = await axios.get(`${GEOCODING_BASE_URL}/search`, {
            params: {
                name: query,
                count: 1,
                language: 'en',
                format: 'json'
            }
        });
        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0];
        }
        throw new Error('Location not found');
    } catch (error) {
        console.error("Error fetching coordinates", error);
        throw error;
    }
};

// Use Open-Meteo for Forecast, Historical, and Marine weather features to ensure 
// they work reliably without Premium tier restrictions from Weatherstack.
export const getForecastAndHistorical = async (lat, lon) => {
    try {
        const response = await axios.get(`${OPEN_METEO_BASE_URL}/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                current_weather: true,
                hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
                daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
                timezone: 'auto',
                past_days: 7, // for historical data
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching forecast from open-meteo", error);
        throw error;
    }
};

export const getMarineWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`https://marine-api.open-meteo.com/v1/marine`, {
            params: {
                latitude: lat,
                longitude: lon,
                hourly: 'wave_height,wave_direction,wave_period',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching marine weather", error);
        throw error;
    }
};
