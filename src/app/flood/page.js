'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { Droplets, AlertCircle, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/line-chart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function FloodContent() {
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat') || 40.7128;
    const lon = searchParams.get('lon') || -74.0060;
    const name = searchParams.get('name') || 'New York';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFlood() {
            setLoading(true);
            try {
                const res = await fetch(`/api/weather?type=flood&lat=${lat}&lon=${lon}`);
                if (!res.ok) throw new Error('Failed to fetch flood data');
                const json = await res.json();

                if (json.daily && json.daily.time && json.daily.time.length > 0) {
                    setData(json.daily);
                } else {
                    setData(null);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchFlood();
    }, [lat, lon]);

    const chartConfig = {
        mean: { label: "Mean (m³/s)", color: "#6366f1" }, // indigo-500
        max: { label: "Max (m³/s)", color: "#818cf8" } // indigo-400
    };

    const chartData = data?.time ? data.time.slice(0, 7).map((timeStr, idx) => ({
        date: format(parseISO(timeStr), 'MMM d'),
        mean: data.river_discharge_mean[idx] ? Number(data.river_discharge_mean[idx].toFixed(2)) : 0,
        max: data.river_discharge_max[idx] ? Number(data.river_discharge_max[idx].toFixed(2)) : 0,
    })) : [];

    return (
        <div className="p-6 md:p-10 w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Droplets className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Global Flood Risk</h1>
                    <p className="text-slate-400">River discharge forecast for {name}</p>
                </div>
            </div>

            {error ? (
                <GlassCard className="p-8 border-red-500/20 bg-red-500/10 flex items-center justify-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <span className="text-red-200">{error}</span>
                </GlassCard>
            ) : loading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-24 w-full" />)}
                </div>
            ) : data ? (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GlassCard className="bg-indigo-900/10 border-indigo-500/20 p-6 flex items-start gap-4">
                        <AlertTriangle className="text-indigo-400 w-6 h-6 shrink-0 mt-1" />
                        <p className="text-sm text-slate-300 leading-relaxed">
                            This data represents the predicted river discharge (m³/s). High discharge volumes relative to historical norms can indicate potential flooding in the grid area.
                        </p>
                    </GlassCard>

                    {/* Shadcn Line Chart */}
                    <Card className="border-white/10 bg-brand-800/20 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white">River Discharge Forecast</CardTitle>
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
                                    <Line dataKey="max" type="monotone" stroke="var(--color-max)" strokeWidth={3} dot={{ r: 4 }} />
                                    <Line dataKey="mean" type="monotone" stroke="var(--color-mean)" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Data Cards */}
                    <div className="flex flex-col gap-4">
                        {data.time.slice(0, 7).map((dateStr, idx) => (
                            <GlassCard key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-white/[0.08] transition-colors border-l-2 border-l-indigo-500 gap-4">
                                <span className="text-white font-medium text-lg min-w-[150px]">
                                    {format(parseISO(dateStr), 'EEEE, MMM d')}
                                </span>
                                <div className="flex-1 w-full flex items-center gap-6 justify-between sm:justify-end">
                                    <div className="text-right">
                                        <span className="text-slate-400 text-xs block">Mean Discharge</span>
                                        <span className="text-white font-bold">{data.river_discharge_mean[idx] ? data.river_discharge_mean[idx].toFixed(2) : 0} <span className="text-slate-500 text-xs font-normal">m³/s</span></span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-400 text-xs block">Max Discharge</span>
                                        <span className="text-indigo-400 font-bold">{data.river_discharge_max[idx] ? data.river_discharge_max[idx].toFixed(2) : 0} <span className="text-slate-500 text-xs font-normal">m³/s</span></span>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ) : (
                <GlassCard><p className="text-slate-400 text-center py-10">No flood / river discharge data available for this specific coordinate block.</p></GlassCard>
            )}
        </div>
    );
}

export default function FloodPage() {
    return (
        <Suspense fallback={<div className="p-10"><SkeletonCard className="h-64" /></div>}>
            <FloodContent />
        </Suspense>
    );
}
