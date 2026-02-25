import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'rgba(10, 11, 16, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border)',
                padding: '12px',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{label}</p>
                <p style={{ margin: '4px 0 0', fontWeight: 'bold', fontSize: '16px' }}>
                    {payload[0].value}{unit}
                </p>
            </div>
        );
    }
    return null;
};

const WeatherChart = ({ data, type = 'temperature', color = 'var(--accent-primary)' }) => {
    // Extract and format data based on the type
    let formattedData = [];
    let dataKey = '';
    let unit = '';

    if (type === 'temperature') {
        // Open-Meteo hourly data format
        const { time, temperature_2m } = data;
        if (time && temperature_2m) {
            // Show next 24 hours
            const now = new Date();
            // Find the index closest to current time
            const startIndex = time.findIndex(t => new Date(t) > now) || 0;
            const sliceEnd = Math.min(startIndex + 24, time.length);

            for (let i = startIndex; i < sliceEnd; i++) {
                formattedData.push({
                    time: new Date(time[i]).toLocaleTimeString([], { hour: 'numeric' }),
                    value: temperature_2m[i]
                });
            }
        }
        dataKey = 'value';
        unit = '°';
    } else if (type === 'marine') {
        // Open-Meteo marine data
        const { time, wave_height } = data;
        if (time && wave_height) {
            const now = new Date();
            const startIndex = time.findIndex(t => new Date(t) > now) || 0;
            const sliceEnd = Math.min(startIndex + 24, time.length);

            for (let i = startIndex; i < sliceEnd; i++) {
                formattedData.push({
                    time: new Date(time[i]).toLocaleTimeString([], { hour: 'numeric' }),
                    value: wave_height[i]
                });
            }
        }
        dataKey = 'value';
        unit = 'm';
    }

    if (formattedData.length === 0) {
        return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No data available for chart</div>;
    }

    return (
        <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formattedData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={20}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `${val}${unit}`}
                    />
                    <Tooltip content={<CustomTooltip unit={unit} />} />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill={`url(#color${type})`}
                        animationDuration={1500}
                        activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeatherChart;
