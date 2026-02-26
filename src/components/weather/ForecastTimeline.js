'use client';

import GlassCard from '../ui/GlassCard';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTemperature } from '@/components/providers/TemperatureProvider';

export default function ForecastTimeline({ data }) {
    const { convertTemp, getUnitSymbol } = useTemperature();

    if (!data || !data.list) return null;

    // Process data for the chart: Extract next 24-48 hours roughly. Data points are 3h apart.
    // Take the first 8-10 items.
    const chartData = data.list.slice(0, 10).map((item) => ({
        time: format(new Date(item.dt * 1000), 'h a'),
        temp: convertTemp(item.main.temp),
        desc: item.weather[0].main,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-brand-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-300 text-xs mb-1">{label}</p>
                    <p className="text-white font-bold">{payload[0].value}{getUnitSymbol()}</p>
                    <p className="text-brand-500 text-xs mt-1">{payload[0].payload.desc}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <GlassCard className="h-72 w-full flex flex-col pt-5 pb-2 px-2">
            <h3 className="text-slate-200 font-medium px-4 mb-4">24-Hour Temperature Forecast ({getUnitSymbol()})</h3>
            <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `${val}°`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
