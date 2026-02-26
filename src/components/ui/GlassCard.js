import { cn } from '@/lib/utils';

export default function GlassCard({ children, className, highlight = false }) {
    return (
        <div
            className={cn(
                'glass-panel p-6 flex flex-col gap-4 transition-all duration-300',
                highlight && 'glass-panel-highlight',
                className
            )}
        >
            {children}
        </div>
    );
}
