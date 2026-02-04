import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = ({ label, error, className, style, ...props }: InputProps) => {
  return (
    <div className={`input-group ${className || ''}`} style={{ marginBottom: label ? 'var(--spacing-md)' : 0 }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-xs)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          fontWeight: 500
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-text-main)',
          fontSize: 'var(--font-size-md)',
          transition: 'all 0.2s',
          outline: 'none',
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;