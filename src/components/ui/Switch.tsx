'use client'

import React from 'react'

interface SwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
}

const Switch = ({ checked, onChange, label }: SwitchProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onChange(!checked)}>
            <div style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                background: checked ? 'var(--color-primary)' : '#E5E7EB',
                borderRadius: '999px',
                transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </div>
            {label && (
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
                    {label}
                </span>
            )}
        </div>
    )
}

export default Switch
