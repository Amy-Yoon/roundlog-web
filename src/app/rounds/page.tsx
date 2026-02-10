'use client'

import React from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { PlusCircle, MapPin, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useRounds } from '@/hooks/useRounds'
import { usePublicRounds } from '@/hooks/usePublicRounds'

interface CourseInfo {
    course_id: string
    course_name: string
    score: number
}

interface GroupedRound {
    id: string
    club_id: string
    club_name: string
    date: string
    user_id: string
    courses: CourseInfo[]
    total_score: number
}

export default function RoundList() {
    const { user } = useAuth()
    const { rounds: userRounds, loading: userLoading } = useRounds()
    const { rounds: publicRounds, loading: publicLoading } = usePublicRounds()
    const router = useRouter()

    // Data Source: Personal or Public
    const roundData = user ? userRounds : publicRounds
    const loading = user ? userLoading : publicLoading

    // Group rounds by club_id + date (one round per golf club visit)
    const groupedRounds = React.useMemo(() => {
        const groups: Record<string, GroupedRound> = {}

        roundData.forEach(round => {
            const key = `${round.club_id}_${round.date}_${round.user_id}`
            if (!groups[key]) {
                groups[key] = {
                    id: round.id,
                    club_id: round.club_id,
                    club_name: round.club_name,
                    date: round.date,
                    user_id: round.user_id,
                    courses: [],
                    total_score: 0
                }
            }
            if (round.round_courses && round.round_courses.length > 0) {
                round.round_courses.forEach(rc => {
                    groups[key].courses.push({
                        course_id: rc.course_id,
                        course_name: rc.course?.name || 'Unknown Course',
                        score: 0
                    })
                })
            } else {
                groups[key].courses.push({
                    course_id: 'unknown',
                    course_name: 'No Course Info',
                    score: 0
                })
            }
            groups[key].total_score += round.total_score
        })

        return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date))
    }, [roundData])

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
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>데이터를 불러오는 중...</div>
                ) : groupedRounds.length > 0 ? (
                    groupedRounds.map(round => (
                        <div key={round.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 20px', background: 'white',
                            borderBottom: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                            className="hover:bg-gray-50"
                            onClick={() => router.push(`/rounds/${round.id}`)}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {/* Line 1: Club Name (Primary) */}
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                    {round.club_name}
                                </div>

                                {/* Line 2: Metadata (Date | Courses) */}
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{round.date.replace(/-/g, '.')}</span>
                                    <span style={{ width: '1px', height: '10px', background: 'var(--color-border)' }}></span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={12} />
                                        <span>{round.courses.map(c => c.course_name).join(' / ')}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '40px', height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--color-bg-light)',
                                    fontSize: '1.1rem', fontWeight: 800,
                                    color: 'var(--color-text-main)'
                                }}>
                                    {round.total_score}
                                </div>
                                <ChevronRight size={18} color="var(--color-text-muted)" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <p>{user ? '기록된 라운드가 없어요.' : '커뮤니티 글이 없어요.'}</p>
                    </div>
                )}
            </div>

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
