import GlassCard from '../ui/GlassCard';
import { Droplets, Wind, Guage, Sun, Eye, Navigation } from 'lucide-react';

export default function WeatherDetailsGrid({ data }) {
    if (!data || !data.main) return null;

    const details = [
        { label: 'Humidity', value: `${data.main.humidity}%`, icon: Droplets, desc: 'Current moisture' },
        { label: 'Wind Speed', value: `${data.wind.speed} m/s`, icon: Wind, desc: `Direction: ${data.wind.deg}°` },
        { label: 'Pressure', value: `${data.main.pressure} hPa`, icon: Navigation, desc: 'Sea level approx.' },
        { label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km`, icon: Eye, desc: 'Clear view roughly' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {details.map((detail, idx) => (
                <GlassCard key={idx} className="p-5 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
                    <div className="flex items-center gap-3 text-brand-500 mb-2">
                        <detail.icon className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-300">{detail.label}</span>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white tracking-tight">{detail.value}</div>
                        <div className="text-xs text-slate-400 mt-1">{detail.desc}</div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
