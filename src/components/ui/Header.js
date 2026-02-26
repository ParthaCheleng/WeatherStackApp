'use client';

import SearchBar from './SearchBar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTemperature } from '@/components/providers/TemperatureProvider';
import { Suspense } from 'react';

export default function Header() {
    const pathname = usePathname();
    const { unit, setUnit } = useTemperature();

    const getTitle = () => {
        switch (pathname) {
            case '/': return "Global Weather Insight";
            case '/historical': return "Historical Data Archive";
            case '/marine': return "Ocean & Marine Intelligence";
            case '/air-quality': return "Atmospheric Purity Index";
            case '/flood': return "Aqueous Discharge Monitor";
            default: return "Dashboard";
        }
    }

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-brand-900/40 border-b border-white/5 py-4 px-6 md:px-10 flex flex-col md:flex-row items-start justify-between md:items-center gap-4 shadow-xl">
            <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{getTitle()}</h1>
                <p className="text-xs text-brand-500 font-medium tracking-wide uppercase mt-0.5">Live Data Feed</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                {/* Temperature Unit Toggle */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
                    {['C', 'F', 'K'].map((u) => (
                        <button
                            key={u}
                            onClick={() => setUnit(u)}
                            className={cn(
                                "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300",
                                unit === u
                                    ? "bg-brand-500 text-white shadow-md"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            °{u === 'K' ? '' : ''}{u}
                        </button>
                    ))}
                </div>

                {/* Global Search */}
                <div className="w-full sm:w-64">
                    <Suspense fallback={<div className="w-full h-10 bg-white/5 animate-pulse rounded-full" />}>
                        <SearchBar />
                    </Suspense>
                </div>
            </div>
        </header>
    );
}
