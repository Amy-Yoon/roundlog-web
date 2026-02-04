'use client'

import React, { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { PlusCircle, MapPin, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useRounds } from '@/hooks/useRounds'
import { MOCK_PUBLIC_ROUNDS } from '@/data/mockPublicRounds'

export default function RoundList() {
    const { user } = useAuth()
    const { rounds } = useRounds()
    const router = useRouter()

    // Data Source: Personal or Public
    const roundData: any[] = user ? rounds : MOCK_PUBLIC_ROUNDS

    // Sort by date desc
    const sortedRounds = [...roundData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>
                    {user ? '라운드 목록' : '전체 커뮤니티'}
                </h1>
                {user && (
                    <Button variant="primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => router.push('/rounds/new')}>
                        <PlusCircle size={16} style={{ marginRight: 4 }} /> 기록하기
                    </Button>
                )}
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                {sortedRounds.length > 0 ? (
                    sortedRounds.map(round => (
                        <div key={round.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 20px', background: 'white',
                            borderBottom: '1px solid var(--color-border)',
                            cursor: user ? 'pointer' : 'default',
                            transition: 'background 0.2s',
                        }}
                            className="hover:bg-gray-50"
                            onClick={() => user && router.push(`/rounds/${round.id}`)}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {/* Line 1: Main Title (Course) */}
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                    {round.course_name}
                                </div>

                                {/* Line 2: Metadata (Date | Type | User) */}
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{round.date.replace(/-/g, '.')}</span>
                                    <span style={{ width: '1px', height: '10px', background: 'var(--color-border)' }}></span>
                                    <span>{round.club_name}</span>
                                    {!user && (
                                        <>
                                            <span style={{ width: '1px', height: '10px', background: 'var(--color-border)' }}></span>
                                            <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{round.userName}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Score */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '40px', height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--color-bg-light)',
                                    fontSize: '1.2rem', fontWeight: 800,
                                    color: 'var(--color-text-main)'
                                }}>
                                    {round.total_score}
                                </div>
                                {user && <ChevronRight size={18} color="var(--color-text-muted)" />}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <p>{user ? '기록된 라운드가 없습니다.' : '커뮤니티 글이 없습니다.'}</p>
                    </div>
                )}
            </div>

            {/* FAB for easier access (Logged In Only) */}
            {user && (
                <Button
                    variant="primary"
                    className="btn-fab"
                    onClick={() => router.push('/rounds/new')}
                    aria-label="New Round"
                >
                    <PlusCircle size={28} />
                </Button>
            )}
        </div>
    )
}
