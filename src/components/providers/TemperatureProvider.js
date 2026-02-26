'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const TemperatureContext = createContext();

export function TemperatureProvider({ children }) {
    // Try to load saved preference, default to Celsius
    const [unit, setUnit] = useState('C');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('weather_temp_unit');
        if (saved) setUnit(saved);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('weather_temp_unit', unit);
        }
    }, [unit, mounted]);

    // Data comes in Celsius from the APIs
    const convertTemp = (celsiusValue) => {
        if (celsiusValue === null || celsiusValue === undefined) return null;

        // Ensure it's a number
        const val = Number(celsiusValue);

        if (unit === 'F') {
            return Math.round((val * 9 / 5) + 32);
        } else if (unit === 'K') {
            return Math.round(val + 273.15);
        }
        return Math.round(val); // default 'C'
    };

    const getUnitSymbol = () => {
        if (unit === 'F') return '°F';
        if (unit === 'K') return 'K';
        return '°C';
    };

    return (
        <TemperatureContext.Provider value={{ unit, setUnit, convertTemp, getUnitSymbol }}>
            {children}
        </TemperatureContext.Provider>
    );
}

export function useTemperature() {
    const context = useContext(TemperatureContext);
    if (context === undefined) {
        throw new Error('useTemperature must be used within a TemperatureProvider');
    }
    return context;
}
