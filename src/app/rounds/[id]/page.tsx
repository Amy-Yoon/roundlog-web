'use client'

import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Share2, Printer, Check, Calendar, Clock, MapPin, DollarSign, Cloud, Wind, Thermometer, Info, Star, Trash2, Users, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Round, RoundCourse, RoundHole, GolfCourse } from '@/types/database.types'

export const dynamic = 'force-dynamic'

interface RoundWithDetails extends Round {
    courses?: (RoundCourse & {
        course?: GolfCourse
        holes?: RoundHole[]
    })[]
}

// DetailRow Component
const DetailRow = ({ label, value, icon: Icon }: { label: string, value: any, icon?: any }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
            {Icon && <Icon size={16} />}
            <span style={{ fontSize: '0.9rem' }}>{label}</span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value || '-'}</div>
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
    const { user } = useAuth()
    const [round, setRound] = useState<RoundWithDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [supabase] = useState(() => createClient())

    // Copy/Share state
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!id) return

        const fetchRound = async () => {
            setLoading(true)
            try {
                // 1. Fetch Round Basic Info
                const { data: roundData, error: roundError } = await supabase
                    .from('rounds')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (roundError) throw roundError

                // 2. Fetch Round Courses
                const { data: coursesData, error: coursesError } = await supabase
                    .from('round_courses')
                    .select('*, course:golf_courses(*)')
                    .eq('round_id', id)
                    .order('sequence', { ascending: true })

                if (coursesError) throw coursesError

                // 3. Fetch Round Holes (Detailed Scores)
                const courses = coursesData || []
                const courseIds = courses.map((c: any) => c.id)
                let holesData: RoundHole[] = []

                if (courseIds.length > 0) {
                    const { data: holes, error: holesError } = await supabase
                        .from('round_holes')
                        .select('*')
                        .in('round_course_id', courseIds)
                        .order('hole_no', { ascending: true })

                    if (holesError) throw holesError
                    holesData = holes
                }

                // 4. Assemble Data
                const fullCourses = courses.map((c: any) => ({
                    ...c,
                    holes: holesData.filter(h => h.round_course_id === c.id).sort((a, b) => a.hole_no - b.hole_no)
                }))

                setRound({
                    ...(roundData as Round),
                    courses: fullCourses
                })

            } catch (error) {
                // Silently handle error
            } finally {
                setLoading(false)
            }
        }

        fetchRound()
    }, [id, supabase])

    const handleShare = async () => {
        const url = `${window.location.origin}/rounds/${id}`
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Round at ${round?.club_name}`,
                    text: `Check out my round at ${round?.club_name} on RoundLog!`,
                    url: url
                })
            } catch (err) {
                // Ignore abort
            }
        } else {
            try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (err) {
                // Silently handle copy failure
            }
        }
    }

    const handleDelete = async () => {
        if (window.confirm('이 라운드 기록을 삭제하시겠습니까?')) {
            const { error } = await supabase.from('rounds').delete().eq('id', id)
            if (error) {
                alert('삭제 중 오류가 발생했습니다.')
            } else {
                router.push('/rounds')
            }
        }
    }

    if (loading) return <div className="p-12 text-center text-gray-400 font-bold">기록을 불러오는 중...</div>
    if (!round) return <div className="p-12 text-center text-gray-400 font-bold">라운드 정보를 찾을 수 없습니다.</div>

    const renderScorecardV2 = (course: RoundCourse & { course?: GolfCourse, holes?: RoundHole[] }) => {
        const holes = course.holes || []
        if (holes.length === 0) return null

        const front9 = holes.slice(0, 9)
        const back9 = holes.slice(9, 18)

        const renderTable = (holeSet: RoundHole[], title: string) => {
            const holesWithComments = holeSet.filter(h => h.hole_comment && h.hole_comment.trim() !== '')

            return (
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>{title}</h4>
                    <div style={{ overflowX: 'auto', background: 'var(--color-bg-light)', borderRadius: '12px', padding: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <th style={{ padding: '6px', textAlign: 'center', color: '#888' }}>홀</th>
                                    {holeSet.map(h => <th key={h.hole_no} style={{ padding: '6px', textAlign: 'center' }}>{h.hole_no}</th>)}
                                    <th style={{ padding: '6px', textAlign: 'center', fontWeight: 800 }}>SUM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <td style={{ padding: '6px', textAlign: 'center', color: '#888' }}>Par</td>
                                    {holeSet.map(h => <td key={h.hole_no} style={{ padding: '6px', textAlign: 'center' }}>{h.par}</td>)}
                                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 800 }}>{holeSet.reduce((acc, h) => acc + h.par, 0)}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px', textAlign: 'center', color: 'var(--color-primary)', fontWeight: 800 }}>Score</td>
                                    {holeSet.map(h => {
                                        const diff = (h.score || 0) - h.par
                                        const scoreColor = diff < 0 ? 'var(--color-danger)' : diff === 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                                        return (
                                            <td key={h.hole_no} style={{ padding: '6px', textAlign: 'center', fontWeight: 900, color: scoreColor }}>
                                                {h.score || '-'}
                                            </td>
                                        )
                                    })}
                                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 900, color: 'var(--color-primary)' }}>
                                        {holeSet.reduce((acc, h) => acc + (h.score || 0), 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Hole Comments */}
                    {holesWithComments.length > 0 && (
                        <div style={{ marginTop: '12px' }}>
                            {holesWithComments.map(hole => (
                                <div key={hole.hole_no} style={{
                                    display: 'flex',
                                    gap: '8px',
                                    marginBottom: '8px',
                                    padding: '8px 12px',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        minWidth: '60px',
                                        color: 'var(--color-primary)',
                                        fontWeight: 600,
                                        fontSize: '0.85rem'
                                    }}>
                                        <MessageCircle size={14} />
                                        {hole.hole_no}번홀
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-main)',
                                        lineHeight: '1.4'
                                    }}>
                                        {hole.hole_comment}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
        }

        return (
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ width: '4px', height: '16px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{course.course?.name || `코스 ${course.sequence}`}</h3>
                </div>
                {renderTable(front9, "")}
                {back9.length > 0 && renderTable(back9, "")}
            </div>
        )
    }

    return (
        <div style={{ paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => router.back()} style={{ marginRight: '10px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>라운드 상세</h1>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleShare} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        {copied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
                    </button>
                    {user && round && user.id === round.user_id && (
                        <button onClick={handleDelete} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Center Card (Hero) */}
            <Card style={{ marginBottom: 'var(--spacing-md)', background: 'white', border: '2px solid var(--color-primary-lighter)' }}>
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, color: 'var(--color-primary)', letterSpacing: '-0.05em' }}>
                        {round.total_score}
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '12px', color: 'var(--color-text-bright)' }}>{round.club_name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 500, marginTop: '4px' }}>
                        {round.courses?.map(c => c.course?.name).join(' / ') || 'Tournament Play'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} color="var(--color-primary)" />
                            <span>{round.date.replace(/-/g, '.')}</span>
                        </div>
                        <div style={{ width: '1px', height: '10px', background: 'var(--color-border)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} color="var(--color-primary)" />
                            <span>{round.tee_time?.slice(0, 5) || '--:--'}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Scorecard Section */}
            {round.courses && round.courses.length > 0 ? (
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span>스코어카드</span>
                            {round.play_tee && (
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'var(--color-bg-light)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', border: '1px solid var(--color-border)' }}>
                                    {round.play_tee} TEE
                                </span>
                            )}
                        </div>
                    }
                    style={{ marginBottom: 'var(--spacing-md)' }}
                >
                    {round.courses.map(course => (
                        <div key={course.id}>
                            {renderScorecardV2(course)}
                        </div>
                    ))}
                </Card>
            ) : (
                <Card style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center', padding: '40px' }}>
                    <Info size={32} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                    <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>상세 스코어 정보가 없습니다.</p>
                </Card>
            )}

            {/* Costs & Conditions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <Card title="라운드 비용">
                    <DetailRow label="그린피" value={round.green_fee ? `₩${Number(round.green_fee).toLocaleString()}` : null} />
                    <DetailRow label="카트피" value={round.cart_fee ? `₩${Number(round.cart_fee).toLocaleString()}` : null} />
                    <DetailRow label="캐디피" value={round.caddy_fee ? `₩${Number(round.caddy_fee).toLocaleString()}` : null} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', marginTop: '4px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>총 합계</span>
                        <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                            {round.total_cost ? `₩${Number(round.total_cost).toLocaleString()}` : '-'}
                        </span>
                    </div>
                </Card>

                <Card title="환경 & 조건">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                        <DetailRow label="날씨" value={round.weather} icon={Cloud} />
                        <DetailRow label="기온" value={round.temperature ? `${round.temperature}°C` : null} icon={Thermometer} />
                        <DetailRow label="풍속" value={round.wind_speed} icon={Wind} />
                        <DetailRow label="그린 스피드" value={round.green_speed} />
                        <DetailRow label="페어웨이 평점" value={round.fairway_rating ? <StarRating rating={round.fairway_rating} /> : null} />
                        <DetailRow label="그린 상태 평점" value={round.green_rating ? <StarRating rating={round.green_rating} /> : null} />
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <DetailRow label="티박스 컨디션" value={round.tee_box_condition} />
                    </div>
                </Card>
            </div>

            {/* Memo Section */}
            {(round.memo || round.partners) && (
                <Card title="동반자 & 메모">
                    {round.partners && (
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>동반자</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                <Users size={16} color="var(--color-primary)" />
                                {round.partners}
                            </div>
                        </div>
                    )}
                    {round.memo && (
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>메모</div>
                            <div style={{ padding: '16px', background: 'var(--color-bg-light)', borderRadius: '12px', color: 'var(--color-text-main)', lineHeight: 1.6, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                {round.memo}
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}
