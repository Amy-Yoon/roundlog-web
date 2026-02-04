'use client'

import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Wind, DollarSign, Users, Trash2, Star, MapPin } from 'lucide-react'
import Card from '@/components/ui/Card'
import { useRounds } from '@/hooks/useRounds'
import { useClubs } from '@/hooks/useClubs'

// DetailRow Component
const DetailRow = ({ label, value, icon: Icon }: { label: string, value: any, icon?: any }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
            {Icon && <Icon size={16} />}
            <span>{label}</span>
        </div>
        <div style={{ fontWeight: 500 }}>{value || '-'}</div>
    </div>
)

// StarRating Component
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={14}
                    fill={star <= rating ? 'var(--color-warning)' : 'none'}
                    color={star <= rating ? 'var(--color-warning)' : 'var(--color-text-muted)'}
                />
            ))}
        </div>
    )
}

export default function RoundDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { rounds, deleteRound } = useRounds()
    const { fetchClubById, fetchHolesByCourse } = useClubs()

    const [clubInfo, setClubInfo] = useState<any>(null)
    const [holes, setHoles] = useState<any[]>([])

    const round: any = rounds.find(r => r.id === id)

    useEffect(() => {
        if (round?.club_id) {
            fetchClubById(round.club_id).then(setClubInfo).catch(console.error)
        }
        if (round?.course_id) {
            fetchHolesByCourse(round.course_id).then(setHoles).catch(console.error)
        }
    }, [round, fetchClubById, fetchHolesByCourse])

    if (!round) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>라운드를 불러오는 중입니다...</h2>
                <button onClick={() => router.push('/')} style={{ marginTop: 20, padding: 10 }}>대시보드로 돌아가기</button>
            </div>
        )
    }

    const handleDelete = async () => {
        if (window.confirm('이 라운드를 삭제하시겠습니까?')) {
            await deleteRound(id)
            router.push('/')
        }
    }

    const totalCost = (Number(round.green_fee || 0) + Number(round.caddy_fee || 0) + Number(round.cart_fee || 0))

    const getTeeBoxLabel = (condition: string) => {
        const labels: Record<string, string> = {
            'many_mats': '매트 많음',
            'some_mats': '매트 종종 있음',
            'well_maintained_grass': '잘 관리된 잔디'
        }
        return labels[condition] || condition
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => router.back()} style={{ marginRight: '10px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>라운드 상세</h1>
                </div>
                <button onClick={handleDelete} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={20} />
                </button>
            </div>

            <Card style={{ marginBottom: 'var(--spacing-md)', background: 'white', border: '2px solid var(--color-primary-lighter)' }}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--color-primary)' }}>{round.total_score}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '8px', color: 'var(--color-text-bright)' }}>{round.club_name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{round.course_name}</div>
                    {clubInfo?.address && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            <MapPin size={14} />
                            {clubInfo.address}
                        </div>
                    )}
                </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 'var(--spacing-md)' }}>
                <Card title="날짜">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="var(--color-primary)" />
                        <span>{round.date}</span>
                    </div>
                </Card>
                <Card title="티타임">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} color="var(--color-primary)" />
                        <span>{round.tee_time?.slice(0, 5)}</span>
                    </div>
                </Card>
            </div>

            {holes.length > 0 && (
                <Card title="코스 정보" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '8px', textAlign: 'center' }}>홀</th>
                                    <th style={{ padding: '8px', textAlign: 'center' }}>Par</th>
                                    <th style={{ padding: '8px', textAlign: 'center' }}>White</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holes.slice(0, 9).map(h => (
                                    <tr key={h.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{h.hole}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{h.par}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{h.distances?.white || '-'}m</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        (전체 홀 정보는 코스 안내 페이지에서 확인 가능합니다)
                    </p>
                </Card>
            )}

            <Card title="라운드 환경" style={{ marginBottom: 'var(--spacing-md)' }}>
                <DetailRow label="날씨" value={`${round.weather}${round.temperature ? `, ${round.temperature}°C` : ''}`} />
                <DetailRow label="바람" value={round.wind_speed} icon={Wind} />
                <DetailRow label="그린 스피드" value={round.green_speed} />
            </Card>

            <Card title="동반자 & 메모">
                <DetailRow label="동반자" value={round.partners} icon={Users} />
                <div style={{ padding: '16px 0', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                    {round.memo || '기억에 남는 순간을 기록해 보세요.'}
                </div>
            </Card>
        </div>
    )
}

