import React, { SelectHTMLAttributes } from 'react';
import { SelectOption } from '@/types/index';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
}

const Select = ({ label, options, className, ...props }: SelectProps) => {
  return (
    <div className={`input-group ${className || ''}`} style={{ marginBottom: 'var(--spacing-md)' }}>
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
      <div style={{ position: 'relative' }}>
        <select
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-main)',
            fontSize: 'var(--font-size-md)',
            appearance: 'none',
            outline: 'none'
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
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'white', color: 'var(--color-text-main)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--color-text-muted)',
          fontSize: '12px'
        }}>▼</div>
      </div>
    </div>
  );
};

export default Select;