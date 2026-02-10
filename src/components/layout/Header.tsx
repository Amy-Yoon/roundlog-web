'use client'

import React from 'react'
import Link from 'next/link'
import { Search, LogOut, LogIn } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

const Header = () => {
    const { user, signInWithGoogle, signOut } = useAuth()

    return (
        <header style={{
            padding: '12px var(--spacing-lg)',
            borderBottom: '1px solid var(--color-border)',
            background: 'rgba(248, 249, 250, 0.8)', // Light semi-transparent
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Logo />
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link href="/search" style={{ color: 'var(--color-text-main)' }}>
                    <Search size={20} />
                </Link>

                {user ? (
                    <button
                        onClick={async () => {
                            try {
                                await signOut();
                            } catch (error) {
                                // Silently handle error
                            }
                        }}
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            border: '1px solid currentColor',
                            borderRadius: '4px',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <LogOut size={16} style={{ marginRight: 4 }} />
                        Logout
                    </button>
                ) : (
                    // In a real app, perhaps redirect to /login page or show modal
                    // For now using Google Sign In direct trigger if wanted, or just a button
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <Button
                            variant="primary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                            <LogIn size={16} style={{ marginRight: 4 }} />
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Header
