import React from 'react';

const Loader = ({ fullScreen = false }) => {
    const loaderContent = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
                style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid var(--glass-border)',
                    borderTopColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '0.05em' }}>
                GATHERING DATA...
            </span>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );

    if (fullScreen) {
        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(10, 11, 16, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {loaderContent}
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
            {loaderContent}
        </div>
    );
};

export default Loader;
