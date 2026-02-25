import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <div className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 16px',
                borderRadius: '30px',
                transition: 'all 0.3s ease'
            }}>
                <Search size={18} color="var(--text-secondary)" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        padding: '12px 12px',
                        width: '100%',
                        fontSize: '15px',
                    }}
                />
                <button
                    type="button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        background: 'var(--glass-highlight)',
                        borderRadius: '50%',
                        color: 'var(--text-primary)',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-highlight)'}
                >
                    <MapPin size={16} />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
