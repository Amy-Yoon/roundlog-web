'use client'

import React, { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Activity, MessageCircle, Flag, TrendingUp, Trophy, Loader2, DollarSign } from 'lucide-react'
import Card from '@/components/ui/Card'
import { useRounds } from '@/hooks/useRounds'
import { usePublicRounds } from '@/hooks/usePublicRounds'
import { useClubs, Club, Course } from '@/hooks/useClubs'

// Internal components
const CourseReviews = ({
    clubId,
    selectedHole,
    onReset
}: {
    clubId: string,
    selectedHole: number | null,
    onReset: () => void
}) => {
    const { fetchPublicRoundsByClub } = usePublicRounds()
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPublicRoundsByClub(clubId).then(data => {
            setReviews(data)
            setLoading(false)
        })
    }, [clubId, fetchPublicRoundsByClub])

    // Filter by hole if selected
    const displayedReviews = selectedHole
        ? reviews.filter((r: any) => {
            const holeComments = r.hole_comments as any[] | null
            return holeComments?.some((c: any) => c.hole === selectedHole)
        })
        : reviews

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader2 className="animate-spin" color="var(--color-primary)" />
            </div>
        )
    }

    if (displayedReviews.length === 0) {
        return (
            <Card style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>
                    {selectedHole
                        ? `${selectedHole}번 홀에 대한 코멘트가 없어요.`
                        : '아직 등록된 리뷰가 없어요.'}
                </p>
                {selectedHole && (
                    <button onClick={onReset} className="btn-text-link" style={{ marginTop: '10px', fontSize: '0.9rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>
                        전체 리뷰 보기
                    </button>
                )}
            </Card>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Filter Banner */}
            {selectedHole && (
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--color-accent)', color: 'white',
                    padding: '10px 16px', borderRadius: '8px', marginBottom: '10px',
                    fontSize: '0.9rem', fontWeight: 600
                }}>
                    <span>🚩 {selectedHole}번 홀 코멘트 모아보기</span>
                    <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', textDecoration: 'underline' }}>
                        전체 보기
                    </button>
                </div>
            )}

            {displayedReviews.map((review: any) => {
                const holeComments = review.hole_comments as any[] | null
                let content = review.memo
                let isHoleComment = false

                if (selectedHole && holeComments) {
                    const holeComment = holeComments.find((c: any) => c.hole === selectedHole)
                    if (holeComment) {
                        content = holeComment.content
                        isHoleComment = true
                    }
                }

                // Calculate cost only if data exists
                const totalCost = (Number(review.green_fee || 0) + Number(review.cart_fee || 0) + Number(review.caddy_fee || 0))

                return (
                    <Card key={review.id} style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'var(--color-bg-light)', color: 'var(--color-text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.8rem'
                                }}>
                                    U
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>User</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(review.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <span style={{
                                    background: 'var(--color-bg-light)', padding: '4px 10px', borderRadius: '12px',
                                    fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)'
                                }}>
                                    {review.total_score}타
                                </span>
                                {totalCost > 0 && (
                                    <span style={{
                                        background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px',
                                        fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-success)'
                                    }}>
                                        {totalCost.toLocaleString()}원
                                    </span>
                                )}
                            </div>
                        </div>
                        {isHoleComment && (
                            <div style={{
                                display: 'inline-block', fontSize: '0.75rem', fontWeight: 700,
                                color: 'var(--color-primary)', background: 'var(--color-primary-light)',
                                padding: '2px 6px', borderRadius: '4px', marginBottom: '6px'
                            }}>
                                {selectedHole}번 홀 Tip
                            </div>
                        )}
                        <p style={{ fontSize: '0.95rem', color: isHoleComment ? 'var(--color-text-main)' : 'var(--color-text-muted)', lineHeight: '1.5' }}>
                            {content || '코멘트가 없습니다.'}
                        </p>
                    </Card>
                )
            })}
        </div>
    )
}

const ClubStats = ({ clubId }: { clubId: string }) => {
    const { fetchPublicRoundsByClub } = usePublicRounds()
    const [stats, setStats] = useState({ count: 0, avgScore: 0, avgCost: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPublicRoundsByClub(clubId).then(rounds => {
            const count = rounds.length
            if (count > 0) {
                const totalScore = rounds.reduce((sum, r) => sum + (Number(r.total_score) || 0), 0)
                const totalCost = rounds.reduce((sum, r) => sum + (Number(r.green_fee || 0) + Number(r.cart_fee || 0) + Number(r.caddy_fee || 0)), 0)
                setStats({
                    count,
                    avgScore: Math.round(totalScore / count),
                    avgCost: Math.round(totalCost / count)
                })
            } else {
                setStats({ count: 0, avgScore: 0, avgCost: 0 })
            }
            setLoading(false)
        })
    }, [clubId, fetchPublicRoundsByClub])

    if (loading) return <div>Stats Loading...</div>

    if (stats.count === 0) return null

    return (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>골프장 통계</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>등록된 라운드</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flag size={16} color="var(--color-accent)" /> {stats.count}회
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>평균 타수</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={16} color="var(--color-accent)" /> {stats.avgScore}
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>평균 비용</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={16} color="var(--color-success)" /> {stats.avgCost.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id: clubId } = use(params)
    const router = useRouter()
    const { fetchClubById, fetchCoursesByClub, fetchHolesByCourse } = useClubs()

    // We remove the direct usePublicRounds list here as child components fetch what they need
    // const { rounds: publicRounds } = usePublicRounds()

    const [club, setClub] = useState<Club | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [selectedSub, setSelectedSub] = useState<Course | null>(null)
    const [holes, setHoles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedHole, setSelectedHole] = useState<number | null>(null)
    const [selectedTee, setSelectedTee] = useState('white')

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const clubData = await fetchClubById(clubId)
                setClub(clubData)

                const coursesData = await fetchCoursesByClub(clubId)
                setCourses(coursesData)
                if (coursesData.length > 0) {
                    setSelectedSub(coursesData[0])
                }
            } catch (err) {
                console.error('Error loading club data:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [clubId])

    useEffect(() => {
        const loadHoles = async () => {
            if (selectedSub) {
                try {
                    const holesData = await fetchHolesByCourse(selectedSub.id)
                    setHoles(holesData)
                } catch (err) {
                    console.error('Error loading holes:', err)
                }
            }
        }
        loadHoles()
    }, [selectedSub])

    // Simplified comment count access would require pre-fetching or stats component, 
    // for now we skip hole-specific comment counts in the main view to keep it clean,
    // or we'd need to lift the state up. 
    // Given the request is "show comments", the below CourseReviews handles the list.
    // The "Hole Talk" numbers might be nice but removing for simplicity/performance 
    // unless we fetch ALL reviews in parent.
    // Let's reimplement lightweight fetching if strictly needed, but for now focus on the requested features.
    // User asked "Link comments". CourseReviews implements this.

    const handleHoleCommentClick = (holeNo: number) => {
        setSelectedHole(holeNo)
        const reviewSection = document.getElementById('reviews-section')
        if (reviewSection) {
            reviewSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
                <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                <p style={{ color: 'var(--color-text-muted)' }}>골프장 정보를 불러오는 중...</p>
            </div>
        )
    }

    if (!club) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>골프장을 찾을 수 없어요.</div>
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <button onClick={() => router.back()} style={{ marginRight: '10px', color: 'var(--color-text-muted)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>골프장 상세</h1>
            </div>

            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-md)',
                border: '2px solid var(--color-primary-lighter)'
            }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-bright)' }}>{club.name}</h2>
                <div style={{ display: 'flex', gap: '15px', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {club.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={14} /> {courses.length}개 코스 보유</span>
                </div>
                <p style={{ lineHeight: 1.5, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                    {club.address || '상세 주소 정보가 없어요.'}
                </p>
            </div>

            {/* Club Stats (Global) */}
            <ClubStats clubId={clubId} />

            {/* Selection Section */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: 'var(--spacing-md)', background: 'white' }}>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '4px', height: '16px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>코스 선택</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {courses.length > 0 ? (
                            courses.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSub(sub)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        background: selectedSub?.id === sub.id ? 'var(--color-primary)' : 'var(--color-bg-light)',
                                        color: selectedSub?.id === sub.id ? 'white' : 'var(--color-text-muted)',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        whiteSpace: 'nowrap',
                                        border: selectedSub?.id === sub.id ? 'none' : '1px solid var(--color-border)',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sub.name}
                                </button>
                            ))
                        ) : (
                            <div style={{ padding: '4px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>등록된 코스가 없어요.</div>
                        )}
                    </div>
                </div>

                {/* Tee Selection */}
                {courses.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '4px', height: '16px', background: 'var(--color-secondary)', borderRadius: '2px' }}></div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>티 선택</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {[
                                { value: 'ladies', label: '레이디 티', color: '#FF6B9D', bg: 'rgba(255, 107, 157, 0.1)' },
                                { value: 'white', label: '화이트 티', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.05)' },
                                { value: 'blue', label: '블루 티', color: '#4A90E2', bg: 'rgba(74, 144, 226, 0.1)' },
                                { value: 'black', label: '블랙 티', color: '#1F2937', bg: 'rgba(31, 41, 55, 0.1)' }
                            ].map(tee => (
                                <button
                                    key={tee.value}
                                    onClick={() => setSelectedTee(tee.value)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        background: selectedTee === tee.value
                                            ? (tee.value === 'white' ? '#FFFFFF' : tee.color)
                                            : tee.bg,
                                        color: selectedTee === tee.value
                                            ? (tee.value === 'white' ? '#111' : 'white')
                                            : tee.color,
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        whiteSpace: 'nowrap',
                                        border: `2px solid ${selectedTee === tee.value ? (tee.value === 'white' ? '#E5E7EB' : tee.color) : 'transparent'}`,
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: selectedTee === tee.value
                                            ? (tee.value === 'white' ? '#E5E7EB' : '#FFFFFF')
                                            : tee.color,
                                        border: tee.value === 'white' ? '1px solid #ccc' : 'none'
                                    }}></div>
                                    {tee.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                {selectedSub ? (
                    <>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-primary-lighter)' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>{selectedSub.name} ({selectedSub.holes}H)</h4>
                        </div>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            <span>Hole</span>
                            <span>Par</span>
                            <span>Dist(m)</span>
                            <span>Hdcp</span>
                            <span>Talks</span>
                        </div>
                        {holes.length > 0 ? (
                            holes.map((hole: any) => {
                                return (
                                    <div key={hole.id} style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontSize: '0.95rem', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{hole.hole}</span>
                                        <span>{hole.par}</span>
                                        <span>{hole.distance || '-'}</span>
                                        <span>{hole.handicap || '-'}</span>
                                        <span>
                                            <span
                                                onClick={() => handleHoleCommentClick(hole.hole)}
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                    padding: '4px 8px', borderRadius: '12px',
                                                    background: 'var(--color-bg-light)', color: 'var(--color-text-muted)',
                                                    fontSize: '0.75rem', fontWeight: 600
                                                }}
                                            >
                                                <MessageCircle size={12} /> Talk
                                            </span>
                                        </span>
                                    </div>
                                )
                            })
                        ) : (
                            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                상세 홀 정보가 없어요.
                            </div>
                        )}
                    </>
                ) : (
                    courses.length > 0 && <div style={{ padding: '20px' }}>코스를 선택해주세요.</div>
                )}
            </Card>

            {/* Reviews Section */}
            <div id="reviews-section" style={{ marginTop: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>유저 리뷰</h3>
                <CourseReviews
                    clubId={clubId}
                    selectedHole={selectedHole}
                    onReset={() => setSelectedHole(null)}
                />
            </div>

        </div>
    )
}
