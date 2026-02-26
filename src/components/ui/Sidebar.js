'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Waves, Wind, Droplets, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';

const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Historical Data', path: '/historical', icon: History },
    { name: 'Marine Weather', path: '/marine', icon: Waves },
    { name: 'Air Quality', path: '/air-quality', icon: Wind },
    { name: 'Global Flood Risk', path: '/flood', icon: Droplets },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 p-6 hidden lg:flex flex-col z-40">
            <div className="flex items-center gap-3 px-4 mb-8">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                    <CloudSun className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Aether<span className="text-brand-500 text-sm align-top ml-0.5">+</span></span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link key={item.path} href={item.path}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group",
                                    isActive
                                        ? "bg-brand-500/10 text-brand-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-brand-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-brand-500")} />
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <GlassCard className="p-4 bg-brand-500/10 border-brand-500/20">
                    <h4 className="text-xs font-semibold text-white mb-1 uppercase tracking-wider">Pro Tier Active</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">You have full access to premium insights globally.</p>
                </GlassCard>
            </div>
        </aside>
    );
}
