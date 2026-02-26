// Open-Meteo API Wrapper
const BASE_URL = 'https://api.open-meteo.com/v1';
const MARINE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const FLOOD_URL = 'https://flood-api.open-meteo.com/v1/flood'; // Note: Flood API structure is tentative based on Open-Meteo Docs

export async function getHistoricalWeather(lat, lon, startDate, endDate) {
    try {
        // startDate and endDate format: YYYY-MM-DD
        const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
        if (!res.ok) throw new Error('Failed to fetch historical data');
        return await res.json();
    } catch (error) {
        console.error('Error fetching historical weather:', error);
        return null;
    }
}

export async function getMarineWeather(lat, lon) {
    try {
        const res = await fetch(`${MARINE_URL}?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&timezone=auto`);
        if (!res.ok) throw new Error('Failed to fetch marine data');
        return await res.json();
    } catch (error) {
        console.error('Error fetching marine weather:', error);
        return null;
    }
}

export async function getAirQuality(lat, lon) {
    try {
        const res = await fetch(`${AQI_URL}?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`);
        if (!res.ok) throw new Error('Failed to fetch air quality data');
        return await res.json();
    } catch (error) {
        console.error('Error fetching air quality:', error);
        return null;
    }
}

export async function getGlobalFlood(lat, lon) {
    try {
        const res = await fetch(`${FLOOD_URL}?latitude=${lat}&longitude=${lon}&daily=river_discharge,river_discharge_mean,river_discharge_max&timezone=auto`);
        if (!res.ok) throw new Error('Failed to fetch flood data');
        return await res.json();
    } catch (error) {
        console.error('Error fetching flood data:', error);
        return null;
    }
}
