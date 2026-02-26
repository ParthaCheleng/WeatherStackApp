'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { TemperatureProvider } from '@/components/providers/TemperatureProvider';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    return (
        <TemperatureProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-10 overflow-x-hidden">
                    <Header />
                    <div className="flex-1 mt-6">
                        {children}
                    </div>
                </main>
            </div>
        </TemperatureProvider>
    );
}
