'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { Waves, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/line-chart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MarineContent() {
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat') || 40.7128;
    const lon = searchParams.get('lon') || -74.0060;
    const name = searchParams.get('name') || 'New York';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMarine() {
            setLoading(true);
            try {
                const res = await fetch(`/api/weather?type=marine&lat=${lat}&lon=${lon}`);
                if (!res.ok) throw new Error('Failed to fetch marine data');
                const json = await res.json();

                // Some inland locations return nothing or error string from API route
                if (json.error || !json.hourly || json.hourly.time.length === 0) {
                    setData([]);
                } else {
                    // Take next 12 hourly readings
                    const next12H = json.hourly.time.slice(0, 12).map((time, idx) => ({
                        time,
                        waveHeight: json.hourly.wave_height?.[idx] || 0,
                        wavePeriod: json.hourly.wave_period?.[idx] || 0,
                    }));
                    setData(next12H);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMarine();
    }, [lat, lon]);

    const chartConfig = {
        waveHeight: { label: "Wave Height (m)", color: "#22d3ee" }, // cyan-400
    };

    const chartData = data ? data.map(d => ({ ...d, timeFormatted: format(parseISO(d.time), 'ha') })) : [];

    return (
        <div className="p-6 md:p-10 w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Waves className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Marine Conditions</h1>
                    <p className="text-slate-400">Wave data for {name}</p>
                </div>
            </div>

            {error ? (
                <GlassCard className="p-8 border-red-500/20 bg-red-500/10 flex items-center justify-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <span className="text-red-200">{error}</span>
                </GlassCard>
            ) : loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} className="h-32 w-full" />)}
                </div>
            ) : data && data.length > 0 ? (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Shadcn Line Chart */}
                    <Card className="border-white/10 bg-brand-800/20 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white">Wave Height Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12, top: 20, bottom: 20 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="timeFormatted"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        stroke="rgba(255,255,255,0.4)"
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Line
                                        dataKey="waveHeight"
                                        type="monotone"
                                        stroke="var(--color-waveHeight)"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "var(--color-waveHeight)" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Data Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.map((item, idx) => (
                            <GlassCard key={idx} className="p-5 flex flex-col justify-between hover:bg-white/[0.08] transition-colors border-l-2 border-l-cyan-500">
                                <span className="text-slate-300 font-medium text-sm mb-4">{format(parseISO(item.time), 'MMM d, h:mm a')}</span>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-slate-400 text-xs block">Wave Height</span>
                                        <span className="text-white font-bold text-xl">{item.waveHeight} m</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-400 text-xs block">Wave Period</span>
                                        <span className="text-cyan-400 font-bold text-xl">{item.wavePeriod} s</span>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ) : (
                <GlassCard><p className="text-slate-400 text-center py-10">No marine data available (Inland location or no ocean nearby).</p></GlassCard>
            )}
        </div>
    );
}

export default function MarinePage() {
    return (
        <Suspense fallback={<div className="p-10"><SkeletonCard className="h-64" /></div>}>
            <MarineContent />
        </Suspense>
    );
}
