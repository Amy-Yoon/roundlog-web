'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, List, Map, BarChart2, User } from 'lucide-react'

const BottomNav = () => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        // Simple check: exact match or starts with (for nested routes like /rounds/123)
        // But for nav items, usually exact or immediate sub-path is better.
        // Dashboard checks for exact '/'
        if (path === '/') return pathname === '/'
        return pathname.startsWith(path)
    }

    const getIconColor = (path: string) =>
        isActive(path) ? 'var(--color-accent)' : 'var(--color-text-muted)'

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--color-bg-dark)',
            borderTop: '1px solid var(--color-border)',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom, 20px)',
            zIndex: 1000
        }}>
            <Link href="/" style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: getIconColor('/') }}>
                <TrendingUp size={24} />
                <span style={{ fontSize: '10px' }}>대시보드</span>
            </Link>
            <Link href="/rounds" style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: getIconColor('/rounds') }}>
                <List size={24} />
                <span style={{ fontSize: '10px' }}>라운드</span>
            </Link>
            <Link href="/courses" style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: getIconColor('/courses') }}>
                <Map size={24} />
                <span style={{ fontSize: '10px' }}>코스</span>
            </Link>
            <Link href="/analysis" style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: getIconColor('/analysis') }}>
                <BarChart2 size={24} />
                <span style={{ fontSize: '10px' }}>분석</span>
            </Link>
            <Link href="/mypage" style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: getIconColor('/mypage') }}>
                <User size={24} />
                <span style={{ fontSize: '10px' }}>마이</span>
            </Link>
        </nav>
    )
}

export default BottomNav
