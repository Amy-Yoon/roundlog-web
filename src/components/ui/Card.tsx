import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  children: React.ReactNode
}

const Card = ({ children, title, className, ...props }: CardProps) => {
  return (
    <div className={`glass-card ${className || ''}`} {...props}>
      {title && (
        <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;