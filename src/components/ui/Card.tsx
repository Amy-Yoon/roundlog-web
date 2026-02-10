import React, { HTMLAttributes } from 'react';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  children: React.ReactNode
}

const Card = ({ children, title, className, style, ...props }: CardProps) => {
  return (
    <div
      className={`glass-card ${className || ''}`}
      style={{
        background: 'white',
        border: '1px solid var(--color-primary-lighter)',
        boxShadow: 'var(--shadow-md)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        ...style
      }}
      {...props}
    >
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '4px', height: '18px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-bright)' }}>
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;