'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SearchBar({ onLocationSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 2) {
                setIsSearching(true);
                try {
                    const res = await fetch(`/api/weather?type=search&query=${encodeURIComponent(query)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setResults(Array.isArray(data) ? data : []);
                        setIsOpen(true);
                    }
                } catch (error) {
                    console.error("Search error", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (location) => {
        setQuery('');
        setIsOpen(false);
        if (onLocationSelect) {
            onLocationSelect(location);
        } else {
            // Stay on current page, but update routing params
            const params = new URLSearchParams(searchParams.toString());
            params.set('lat', location.lat);
            params.set('lon', location.lon);
            params.set('name', location.name);
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    return (
        <div className="relative w-full max-w-md z-50">
            <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400">
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for cities..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all backdrop-blur-md shadow-lg"
                />
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-brand-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                    {results.map((loc, i) => (
                        <button
                            key={`${loc.lat}-${loc.lon}-${i}`}
                            onClick={() => handleSelect(loc)}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-3 transition-colors text-sm"
                        >
                            <MapPin className="w-4 h-4 text-brand-500" />
                            <div>
                                <span className="text-white font-medium">{loc.name}</span>
                                {loc.state && <span className="text-slate-400 ml-1">, {loc.state}</span>}
                                <span className="text-slate-500 ml-1 text-xs">{loc.country}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
