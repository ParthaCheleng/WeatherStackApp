import React from 'react';

const WeatherCard = ({ title, value, subtitle, icon: Icon, delay = 0 }) => {
    return (
        <div
            className="glass-card"
            style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: `fadeInUp 0.6s ease-out ${delay}s both`
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
                {Icon && <Icon size={20} />}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1', letterSpacing: '-0.02em' }}>
                    {value}
                </span>
                {subtitle && (
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
};

export default WeatherCard;
