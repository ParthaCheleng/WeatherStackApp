import GlassCard from '../ui/GlassCard';
import { Cloud, Droplets, Wind, Thermometer, CloudRain } from 'lucide-react';
import { useTemperature } from '@/components/providers/TemperatureProvider';
import {
    SunIcon, MoonIcon, CloudIcon, RainIcon, HeavyRainIcon,
    SnowIcon, ThunderIcon, FogIcon, PartlyCloudyIcon
} from '@/components/ui/animated-weather-icons';

const getWeatherIcon = (condition, desc, isNight) => {
    switch (condition.toLowerCase()) {
        case 'clear': return isNight ? <MoonIcon size={120} /> : <SunIcon size={120} />;
        case 'clouds':
            if (desc.includes('few') || desc.includes('scattered')) return <PartlyCloudyIcon size={120} />;
            return <CloudIcon size={120} />;
        case 'rain':
        case 'drizzle':
            if (desc.includes('heavy') || desc.includes('extreme')) return <HeavyRainIcon size={120} />;
            return <RainIcon size={120} />;
        case 'thunderstorm': return <ThunderIcon size={120} />;
        case 'snow': return <SnowIcon size={120} />;
        case 'atmosphere':
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
            return <FogIcon size={120} />;
        default: return <CloudIcon size={120} />;
    }
};

export default function CurrentWeatherDisplay({ data }) {
    const { convertTemp, getUnitSymbol } = useTemperature();

    if (!data || !data.weather) return null;

    const { main, weather, name, sys, wind } = data;
    const currentCondition = weather[0].main;
    const description = weather[0].description;
    const isNight = weather[0].icon.includes('n');

    const temp = convertTemp(main.temp);
    const feelsLike = convertTemp(main.feels_like);

    return (
        <GlassCard highlight className="relative overflow-hidden w-full col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{name}{sys?.country ? `, ${sys.country}` : ''}</h2>
                    <p className="text-slate-300 capitalize text-lg mt-1">{description}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 z-10 relative">
                <div className="flex flex-col">
                    <div className="text-7xl font-light text-white tracking-tighter">
                        {temp}<span className="text-4xl">{getUnitSymbol()}</span>
                    </div>
                    <div className="text-slate-400 mt-2 flex items-center gap-1 font-medium">
                        <Thermometer className="w-4 h-4" /> Feels like {feelsLike}{getUnitSymbol()}
                    </div>
                </div>

                {/* Weather Icon (Animated) */}
                <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {getWeatherIcon(currentCondition, description, isNight)}
                </div>
            </div>
        </GlassCard>
    );
}
