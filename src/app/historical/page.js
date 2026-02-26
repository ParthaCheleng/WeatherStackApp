'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { History, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useTemperature } from '@/components/providers/TemperatureProvider';
import { LineChart, Line, XAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/line-chart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function HistoricalContent() {
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat') || 40.7128;
    const lon = searchParams.get('lon') || -74.0060;
    const name = searchParams.get('name') || 'New York';
    const { convertTemp, getUnitSymbol } = useTemperature();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchHistorical() {
            setLoading(true);
            try {
                const res = await fetch(`/api/weather?type=historical&lat=${lat}&lon=${lon}`);
                if (!res.ok) throw new Error('Failed to fetch historical data');
                const json = await res.json();
                setData(json.daily);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchHistorical();
    }, [lat, lon]);

    const chartData = data?.time?.map((dateStr, idx) => ({
        date: format(parseISO(dateStr), 'MMM d'),
        maxTemp: convertTemp(data.temperature_2m_max[idx]),
        minTemp: convertTemp(data.temperature_2m_min[idx])
    })) || [];

    const chartConfig = {
        maxTemp: { label: "Max Temp", color: "#f87171" },
        minTemp: { label: "Min Temp", color: "#60a5fa" }
    };

    return (
        <div className="p-6 md:p-10 w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                    <History className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Historical Data</h1>
                    <p className="text-slate-400">Past 7 days for {name}</p>
                </div>
            </div>

            {error ? (
                <GlassCard className="p-8 border-red-500/20 bg-red-500/10 flex items-center justify-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <span className="text-red-200">{error}</span>
                </GlassCard>
            ) : loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} className="h-24 w-full" />)}
                </div>
            ) : data?.time ? (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Shadcn Line Chart */}
                    <Card className="border-white/10 bg-brand-800/20 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white">Temperature Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12, top: 20, bottom: 20 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        stroke="rgba(255,255,255,0.4)"
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Line
                                        dataKey="maxTemp"
                                        type="bump"
                                        stroke="var(--color-maxTemp)"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "var(--color-maxTemp)" }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        dataKey="minTemp"
                                        type="bump"
                                        stroke="var(--color-minTemp)"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "var(--color-minTemp)" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Data Cards */}
                    <div className="flex flex-col gap-4">
                        {data.time.map((dateStr, idx) => (
                            <GlassCard key={idx} className="flex flex-row items-center justify-between p-5 hover:bg-white/[0.08] transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-white font-medium text-lg">{format(parseISO(dateStr), 'EEEE, MMM d')}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="text-slate-400 text-sm block">Max Temp</span>
                                        <span className="text-white font-bold">{convertTemp(data.temperature_2m_max[idx])}{getUnitSymbol()}</span>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <span className="text-slate-400 text-sm block">Min Temp</span>
                                        <span className="text-white font-bold">{convertTemp(data.temperature_2m_min[idx])}{getUnitSymbol()}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-400 text-sm block">Precipitation</span>
                                        <span className="text-brand-500 font-bold">{data.precipitation_sum[idx]} mm</span>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ) : (
                <GlassCard><p className="text-slate-400 text-center py-10">No historical data available for this location.</p></GlassCard>
            )}
        </div>
    );
}

export default function HistoricalPage() {
    return (
        <Suspense fallback={<div className="p-10"><SkeletonCard className="h-64" /></div>}>
            <HistoricalContent />
        </Suspense>
    );
}
