import GlassCard from './GlassCard';

export default function SkeletonCard({ className }) {
    return (
        <GlassCard className={`animate-pulse ${className}`}>
            <div className="h-6 w-1/3 bg-white/10 rounded-md mb-4"></div>
            <div className="h-10 w-1/2 bg-white/10 rounded-md mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded-md"></div>
                <div className="h-4 w-5/6 bg-white/10 rounded-md"></div>
                <div className="h-4 w-4/6 bg-white/10 rounded-md"></div>
            </div>
        </GlassCard>
    );
}
