'use client'

import React from 'react'
import { Lock, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface LoginRequiredProps {
    title?: string
    description?: string
}

export default function LoginRequired({
    title = '로그인이 필요해요',
    description = '이 페이지의 내용을 확인하려면\n로그인이 필요합니다.'
}: LoginRequiredProps) {
    const router = useRouter()

    return (
        <div style={{
            height: 'calc(100vh - 150px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                color: 'var(--color-primary)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <Lock size={40} />
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-bright)' }}>
                {title}
            </h1>

            <p style={{
                fontSize: '1rem',
                color: 'var(--color-text-muted)',
                lineHeight: '1.6',
                marginBottom: '32px',
                maxWidth: '400px'
            }}>
                {description}
            </p>

            <Button
                variant="primary"
                onClick={() => router.push('/login')}
                style={{
                    padding: '14px 28px',
                    fontSize: '1rem',
                    gap: '8px',
                    boxShadow: '0 8px 16px -4px rgba(76, 175, 80, 0.3)'
                }}
            >
                <LogIn size={20} />
                로그인하러 가기
            </Button>
        </div>
    )
}
