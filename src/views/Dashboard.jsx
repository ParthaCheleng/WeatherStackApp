import React from 'react';
import {
    CloudRain,
    Wind,
    Droplets,
    Thermometer,
    Sunrise,
    Sunset,
    Navigation,
    Waves
} from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import WeatherChart from '../components/WeatherChart';

const Dashboard = ({ data }) => {
    const { location, current, forecast, hourly, marine } = data;

    // Render weather gracefully based on what data is available.
    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
                    {location.name}, <span style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>{location.country}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Lat: {location.lat.toFixed(2)}° • Lon: {location.lon.toFixed(2)}°
                </p>
            </header>

            <div className="dashboard-grid">
                <div className="main-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Top Metrics Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {current && (
                            <>
                                <WeatherCard
                                    title="Current Temp"
                                    value={`${current.temperature}°`}
                                    subtitle={`Feels like ${current.feelslike || current.temperature}°`}
                                    icon={Thermometer}
                                    delay={0.1}
                                />
                                <WeatherCard
                                    title="Wind Speed"
                                    value={`${current.wind_speed}km/h`}
                                    subtitle={`Dir: ${current.wind_dir}`}
                                    icon={Wind}
                                    delay={0.2}
                                />
                                <WeatherCard
                                    title="Humidity"
                                    value={`${current.humidity}%`}
                                    icon={Droplets}
                                    delay={0.3}
                                />
                                <WeatherCard
                                    title="Precipitation"
                                    value={`${current.precip || 0}mm`}
                                    icon={CloudRain}
                                    delay={0.4}
                                />
                            </>
                        )}
                    </div>

                    {/* Charts Area */}
                    <div className="glass-panel" style={{ padding: '24px', animation: 'fadeInUp 0.6s ease 0.5s both' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Temperature Forecast</h3>
                        </div>
                        {hourly && <WeatherChart data={hourly} type="temperature" />}
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', animation: 'fadeInUp 0.6s ease 0.6s both' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Marine Conditions</h3>
                        </div>
                        {marine ? (
                            <WeatherChart data={marine} type="marine" color="var(--accent-secondary)" />
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Marine data not available for this inland location.
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Sidebar: Daily Forecast & Details */}
                <div className="side-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div className="glass-panel" style={{ padding: '24px', animation: 'fadeInRight 0.6s ease 0.7s both' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-secondary)' }}>RAIN FORECAST</h3>
                        {forecast && forecast.precipitation_sum && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CloudRain color="var(--accent-primary)" />
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Today's Rainfall</div>
                                        <div style={{ fontWeight: '500' }}>{forecast.precipitation_sum[7]} mm</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Droplets color="var(--accent-secondary)" />
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rain Probability</div>
                                        <div style={{ fontWeight: '500' }}>{forecast.precipitation_probability_max[7]}%</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', animation: 'fadeInRight 0.6s ease 0.7s both', flex: 1 }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-secondary)' }}>7-DAY FORECAST</h3>
                        {forecast && forecast.time && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {/* Start from index 7 (Today) and slice the next 7 days */}
                                {forecast.time.slice(7, 14).map((time, idx) => {
                                    // Offset the index by 7 since we sliced from 7
                                    const actualIndex = idx + 7;
                                    const dateObj = new Date(time);
                                    const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                                    return (
                                        <div key={time} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingBottom: '12px',
                                            borderBottom: idx < 6 ? '1px solid var(--glass-border)' : 'none'
                                        }}>
                                            <span style={{ width: '50px', fontWeight: '500' }}>{dayName}</span>
                                            <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)' }}>
                                                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{forecast.temperature_2m_max[actualIndex]}°</span>
                                                <span>{forecast.temperature_2m_min[actualIndex]}°</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
