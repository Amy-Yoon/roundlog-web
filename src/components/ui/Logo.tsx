import React from 'react';
import { Flag } from 'lucide-react';

const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        background: 'var(--color-primary)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)'
      }}>
        <Flag size={18} color="white" fill="white" />
      </div>
      <div style={{
        fontSize: '1.25rem',
        fontWeight: 800,
        color: 'var(--color-text-main)',
        letterSpacing: '-0.5px',
      }}>
        Round<span style={{ color: 'var(--color-primary)' }}>Log</span>
      </div>
    </div>
  );
};

export default Logo;