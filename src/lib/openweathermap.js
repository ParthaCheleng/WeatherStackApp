// OpenWeatherMap API Wrapper
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'acb9995987c73a4bc691d024da3f2cd2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function searchLocation(query) {
    try {
        const res = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch location data');
        return await res.json();
    } catch (error) {
        console.error('Error fetching location:', error);
        return [];
    }
}

export async function getCurrentWeather(lat, lon) {
    try {
        const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`, { next: { revalidate: 1800 } });
        if (!res.ok) throw new Error('Failed to fetch current weather');
        return await res.json();
    } catch (error) {
        console.error('Error fetching current weather:', error);
        return null;
    }
}

export async function getForecast(lat, lon) {
    try {
        const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('Failed to fetch forecast');
        return await res.json();
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return null;
    }
}
