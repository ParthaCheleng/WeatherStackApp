import { NextResponse } from 'next/server';
import { searchLocation, getCurrentWeather, getForecast } from '@/lib/openweathermap';
import { getHistoricalWeather, getMarineWeather, getAirQuality, getGlobalFlood } from '@/lib/openmeteo';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const query = searchParams.get('query');

    try {
        switch (type) {
            case 'search':
                if (!query) return NextResponse.json({ error: 'Query is required' }, { status: 400 });
                const locations = await searchLocation(query);
                return NextResponse.json(locations);

            case 'current':
                if (!lat || !lon) return NextResponse.json({ error: 'Lat and Lon are required' }, { status: 400 });
                const current = await getCurrentWeather(lat, lon);
                return NextResponse.json(current);

            case 'forecast':
                if (!lat || !lon) return NextResponse.json({ error: 'Lat and Lon are required' }, { status: 400 });
                const forecast = await getForecast(lat, lon);
                return NextResponse.json(forecast);

            case 'historical':
                // Example: past 7 days
                const endDate = new Date().toISOString().split('T')[0];
                const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const historical = await getHistoricalWeather(lat, lon, startDate, endDate);
                return NextResponse.json(historical);

            case 'marine':
                const marine = await getMarineWeather(lat, lon);
                return NextResponse.json(marine);

            case 'aqi':
                const aqi = await getAirQuality(lat, lon);
                return NextResponse.json(aqi);

            case 'flood':
                const flood = await getGlobalFlood(lat, lon);
                return NextResponse.json(flood);

            default:
                return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });
        }
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
