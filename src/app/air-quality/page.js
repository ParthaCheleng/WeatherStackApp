'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { Wind, AlertCircle, Leaf } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/line-chart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AQIContent() {
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat') || 40.7128;
    const lon = searchParams.get('lon') || -74.0060;
    const name = searchParams.get('name') || 'New York';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAQI() {
            setLoading(true);
            try {
                const res = await fetch(`/api/weather?type=aqi&lat=${lat}&lon=${lon}`);
                if (!res.ok) throw new Error('Failed to fetch AQI data');
                const json = await res.json();

                if (json.hourly && json.hourly.time.length > 0) {
                    const next24 = json.hourly.time.slice(0, 24).map((time, idx) => ({
                        time,
                        timeFormatted: format(parseISO(time), 'ha'),
                        pm10: json.hourly.pm10[idx],
                        pm25: json.hourly.pm2_5[idx],
                        co: json.hourly.carbon_monoxide[idx],
                        no2: json.hourly.nitrogen_dioxide[idx],
                        o3: json.hourly.ozone[idx],
                    }));
                    setData(next24);
                } else {
                    setData(null);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAQI();
    }, [lat, lon]);

    const currentData = data ? data[0] : null;

    const pollutantCards = [
        { label: 'PM 10', value: currentData?.pm10, unit: 'μg/m³', color: 'text-amber-400' },
        { label: 'PM 2.5', value: currentData?.pm25, unit: 'μg/m³', color: 'text-red-400' },
        { label: 'Carbon Monoxide', value: currentData?.co, unit: 'μg/m³', color: 'text-blue-400' },
        { label: 'Nitrogen Dioxide', value: currentData?.no2, unit: 'μg/m³', color: 'text-orange-400' },
        { label: 'Ozone', value: currentData?.o3, unit: 'μg/m³', color: 'text-emerald-400' },
    ];

    const chartConfig = {
        pm10: { label: "PM 10", color: "#fbbf24" },
        pm25: { label: "PM 2.5", color: "#f87171" },
        o3: { label: "Ozone", color: "#34d399" }
    };

    return (
        <div className="p-6 md:p-10 w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Wind className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Air Quality Index</h1>
                    <p className="text-slate-400">Pollutant levels for {name}</p>
                </div>
            </div>

            {error ? (
                <GlassCard className="p-8 border-red-500/20 bg-red-500/10 flex items-center justify-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <span className="text-red-200">{error}</span>
                </GlassCard>
            ) : loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} className="h-32 w-full" />)}
                </div>
            ) : data ? (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Shadcn Line Chart */}
                    <Card className="border-white/10 bg-brand-800/20 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white">24-Hour Pollutant Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12, top: 20, bottom: 20 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="timeFormatted"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        stroke="rgba(255,255,255,0.4)"
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Line dataKey="pm10" type="monotone" stroke="var(--color-pm10)" strokeWidth={2} dot={false} />
                                    <Line dataKey="pm25" type="monotone" stroke="var(--color-pm25)" strokeWidth={2} dot={false} />
                                    <Line dataKey="o3" type="monotone" stroke="var(--color-o3)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Data Cards for Current/Now */}
                    <h3 className="text-slate-300 font-medium px-2">Current Primary Pollutants</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pollutantCards.map((item, idx) => (
                            <GlassCard key={idx} className="p-6 flex flex-col justify-between hover:bg-white/[0.08] transition-colors relative overflow-hidden group">
                                <Leaf className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity ${item.color}`} />
                                <div className="text-slate-300 font-medium text-sm mb-4 relative z-10">{item.label}</div>
                                <div className="flex items-end gap-2 relative z-10">
                                    <span className={`text-3xl font-bold tracking-tight ${item.color}`}>{item.value || 0}</span>
                                    <span className="text-slate-400 text-sm mb-1">{item.unit}</span>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ) : (
                <GlassCard><p className="text-slate-400 text-center py-10">No air quality data available.</p></GlassCard>
            )}
        </div>
    );
}

export default function AQIPage() {
    return (
        <Suspense fallback={<div className="p-10"><SkeletonCard className="h-64" /></div>}>
            <AQIContent />
        </Suspense>
    );
}
