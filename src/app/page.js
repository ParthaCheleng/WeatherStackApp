'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CurrentWeatherDisplay from '@/components/weather/CurrentWeatherDisplay';
import WeatherDetailsGrid from '@/components/weather/WeatherDetailsGrid';
import ForecastTimeline from '@/components/weather/ForecastTimeline';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { AlertCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

function DashboardContent() {
    const searchParams = useSearchParams();
    const queryLat = searchParams.get('lat');
    const queryLon = searchParams.get('lon');

    // Default to New York if no location provided
    const [location, setLocation] = useState({ lat: queryLat || 40.7128, lon: queryLon || -74.0060 });

    useEffect(() => {
        if (queryLat && queryLon) {
            setLocation({ lat: queryLat, lon: queryLon });
        }
    }, [queryLat, queryLon]);

    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const [curRes, forecastRes] = await Promise.all([
                    fetch(`/api/weather?type=current&lat=${location.lat}&lon=${location.lon}`),
                    fetch(`/api/weather?type=forecast&lat=${location.lat}&lon=${location.lon}`)
                ]);

                if (!curRes.ok || !forecastRes.ok) throw new Error('Failed to fetch weather data');

                const curData = await curRes.json();
                const forecastData = await forecastRes.json();

                setCurrentWeather(curData);
                setForecast(forecastData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [location]);

    return (
        <div className="p-6 md:p-10 w-full max-w-7xl mx-auto flex flex-col gap-8">
            {/* Main Content Area */}
            {error ? (
                <GlassCard className="p-8 border-red-500/20 bg-red-500/10 flex items-center justify-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <span className="text-red-200">{error}</span>
                </GlassCard>
            ) : loading ? (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <SkeletonCard className="col-span-1 lg:col-span-1 h-64" />
                        <SkeletonCard className="col-span-1 lg:col-span-2 h-64" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} className="h-32" />)}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <CurrentWeatherDisplay data={currentWeather} />
                        <div className="col-span-1 lg:col-span-2 h-full">
                            <ForecastTimeline data={forecast} />
                        </div>
                    </div>
                    <WeatherDetailsGrid data={currentWeather} />
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="p-10 w-full max-w-7xl mx-auto flex flex-col gap-8">
                <SkeletonCard className="h-20" />
                <SkeletonCard className="h-64" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    )
}
