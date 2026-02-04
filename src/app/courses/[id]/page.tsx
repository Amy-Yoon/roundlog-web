'use client'

import React, { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Activity, MessageCircle, Flag, TrendingUp, Trophy } from 'lucide-react'
import Card from '@/components/ui/Card'
import { MOCK_COURSES } from '@/data/courses'
import { useRounds } from '@/hooks/useRounds'
import { MOCK_PUBLIC_ROUNDS } from '@/data/mockPublicRounds'

// Internal components
const CourseReviews = ({ courseName, selectedHole, onReset }: { courseName: string, selectedHole: number | null, onReset: () => void }) => {
    // Filter public rounds for this course
    const allReviews = MOCK_PUBLIC_ROUNDS.filter(r =>
        r.course_name.includes(courseName) || courseName.includes(r.course_name) ||
        (courseName.includes("Sky72") && r.course_name === "Sky72 Alpha") // Demo data match
    )

    // If filtering by hole, only match rounds that have a comment for that hole
    const displayedReviews = selectedHole
        ? allReviews.filter(r => r.holeComments?.some((c: any) => c.hole === selectedHole))
        : allReviews

    if (displayedReviews.length === 0) {
        return (
            <Card style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>
                    {selectedHole
                        ? `${selectedHole}번 홀에 대한 코멘트가 없습니다.`
                        : '아직 등록된 리뷰가 없습니다.'}
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

            {displayedReviews.map(review => {
                // Determine what content to show: specific hole comment or general memo
                let content = review.memo
                let isHoleComment = false

                if (selectedHole && review.holeComments) {
                    const holeComment = review.holeComments.find((c: any) => c.hole === selectedHole)
                    if (holeComment) {
                        content = holeComment.content
                        isHoleComment = true
                    }
                }

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
                                    {review.userName.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{review.userName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{review.date}</div>
                                </div>
                            </div>
                            <div style={{
                                background: 'var(--color-bg-light)', padding: '4px 10px', borderRadius: '12px',
                                fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)'
                            }}>
                                {review.total_score}타
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

const MyCourseStats = ({ courseName }: { courseName: string }) => {
    const { rounds } = useRounds() // Assuming useRounds fetches user's rounds

    // Filter rounds for this course (name matching)
    // Relaxed matching to handle legacy data (e.g. "Sky72 CC" vs "스카이72 CC")
    const myRounds = rounds.filter(r => {
        const rCourseName = r.course_name
        return rCourseName === courseName ||
            rCourseName.includes(courseName) ||
            (courseName.includes("스카이72") && rCourseName.toLowerCase().includes("sky72")) ||
            (courseName.includes("Sky72") && rCourseName.includes("스카이72"))
    })
    const visitCount = myRounds.length

    // Calculate Average Score
    const avgScore = visitCount > 0
        ? Math.round(myRounds.reduce((acc, curr) => acc + Number(curr.total_score), 0) / visitCount)
        : '-'

    // Calculate Best Score
    const bestScore = visitCount > 0
        ? Math.min(...myRounds.map(r => Number(r.total_score)))
        : '-'

    if (visitCount === 0) return null

    return (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>나의 기록</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>방문 횟수</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flag size={16} color="var(--color-accent)" /> {visitCount}회
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>평균 타수</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={16} color="var(--color-accent)" /> {avgScore}
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>베스트</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trophy size={16} color="var(--color-warning)" /> {bestScore}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const course = MOCK_COURSES.find(c => c.id === id)

    // Default to first subcourse if available
    const [selectedSub, setSelectedSub] = useState<any>(course?.subCourses?.[0] || null)
    const [selectedHole, setSelectedHole] = useState<number | null>(null)
    const [selectedTee, setSelectedTee] = useState('white') // Default to white tee

    // Calculate hole comment counts
    const getHoleCommentCount = (holeNo: number) => {
        let count = 0
        if (!course) return 0

        // Filter public rounds for this course
        const publicRounds = MOCK_PUBLIC_ROUNDS.filter(r =>
            r.course_name.includes(course.name) || course.name.includes(r.course_name) ||
            (course.name.includes("Sky72") && r.course_name === "Sky72 Alpha")
        )

        publicRounds.forEach(r => {
            if (r.holeComments) {
                const comment = r.holeComments.find((c: any) => c.hole === holeNo)
                if (comment) count++
            }
        })
        return count
    }

    const handleHoleCommentClick = (holeNo: number) => {
        setSelectedHole(holeNo)
        // Scroll to reviews
        const reviewSection = document.getElementById('reviews-section')
        if (reviewSection) {
            reviewSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    if (!course) {
        return <div style={{ padding: '20px' }}>코스를 찾을 수 없습니다.</div>
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <button onClick={() => router.back()} style={{ marginRight: '10px', color: 'var(--color-text-muted)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>코스 상세</h1>
            </div>

            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-md)',
                border: '2px solid var(--color-primary-lighter)'
            }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-bright)' }}>{course.name}</h2>
                <div style={{ display: 'flex', gap: '15px', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {course.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={14} /> {course.subCourses ? course.subCourses.length : 0}개 코스 보유</span>
                </div>
                <p style={{ lineHeight: 1.5, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                    {course.description}
                </p>
            </div>

            <MyCourseStats courseName={course.name} />

            {/* SubCourse Tabs */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>코스 선택</h3>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
                {course.subCourses?.map(sub => (
                    <button
                        key={sub.id}
                        onClick={() => setSelectedSub(sub)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            background: selectedSub?.id === sub.id ? 'var(--color-primary)' : 'var(--color-bg-light)',
                            color: selectedSub?.id === sub.id ? 'white' : 'var(--color-text-muted)',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            border: selectedSub?.id === sub.id ? 'none' : '1px solid var(--color-border)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {sub.name}
                    </button>
                )) || <div>No sub courses</div>}
            </div>

            {/* Tee Type Selector */}
            <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {[{ value: 'ladies', label: '레이디 티', color: '#FF6B9D' }, { value: 'white', label: '화이트 티', color: '#FFFFFF' }, { value: 'blue', label: '블루 티', color: '#4A90E2' }, { value: 'black', label: '블랙 티', color: '#2C3E50' }].map(tee => (
                        <button
                            key={tee.value}
                            onClick={() => setSelectedTee(tee.value)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '16px',
                                background: selectedTee === tee.value ? tee.color : 'var(--color-bg-light)',
                                color: selectedTee === tee.value ? (tee.value === 'white' ? '#333' : 'white') : 'var(--color-text-muted)',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap',
                                border: selectedTee === tee.value ? 'none' : `1px solid ${tee.value === 'white' ? '#ccc' : tee.color}`,
                                transition: 'all 0.2s'
                            }}
                        >
                            {tee.label}
                        </button>
                    ))}
                </div>
            </div>

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                {selectedSub ? (
                    <>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-primary-lighter)' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>{selectedSub.name} ({selectedSub.holes}H / P{selectedSub.par})</h4>
                        </div>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            <span>Hole</span>
                            <span>Par</span>
                            <span>Dist(m)</span>
                            <span>Hdcp</span>
                            <span>Talks</span>
                        </div>
                        {selectedSub.holeData && selectedSub.holeData.length > 0 ? (
                            selectedSub.holeData.map((hole: any) => {
                                const commentCount = getHoleCommentCount(hole.hole)
                                return (
                                    <div key={hole.hole} style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontSize: '0.95rem', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{hole.hole}</span>
                                        <span>{hole.par}</span>
                                        <span>{hole.distances ? hole.distances[selectedTee] : hole.distance}</span>
                                        <span>{hole.handicap}</span>
                                        <span>
                                            {commentCount > 0 ? (
                                                <span
                                                    onClick={() => handleHoleCommentClick(hole.hole)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '4px 8px', borderRadius: '12px',
                                                        background: 'var(--color-primary)', color: 'white',
                                                        fontSize: '0.75rem', fontWeight: 700
                                                    }}
                                                >
                                                    <MessageCircle size={12} /> {commentCount}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>-</span>
                                            )}
                                        </span>
                                    </div>
                                )
                            })
                        ) : (
                            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                상세 홀 정보가 없습니다.
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ padding: '20px' }}>코스를 선택해주세요.</div>
                )}
            </Card>

            {/* Reviews Section */}
            <div id="reviews-section" style={{ marginTop: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>유저 리뷰</h3>
                <CourseReviews
                    courseName={course.name}
                    selectedHole={selectedHole}
                    onReset={() => setSelectedHole(null)}
                />
            </div>

        </div>
    )
}
