'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, Info, MapPin, Activity, Plus } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useRounds } from '@/hooks/useRounds'
import { useClubs, Course } from '@/hooks/useClubs'
import { useAuth } from '@/contexts/AuthContext'
import { RoundInsert } from '@/types/database.types'
import Switch from '@/components/ui/Switch'
import { Star } from 'lucide-react'

const formatNumber = (val: string) => {
    if (!val) return ''
    const num = val.replace(/[^0-9]/g, '')
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const unformatNumber = (val: string) => {
    return val.replace(/[^0-9]/g, '')
}

export const dynamic = 'force-dynamic'

function LogRoundContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preFilledClubId = searchParams.get('clubId')
    // @ts-ignore
    const { createRound } = useRounds()
    const { clubs, fetchCoursesByClub, fetchHolesByCourse } = useClubs()
    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState<'essential' | 'detail'>('essential')

    // Core Data
    const [availableCourses, setAvailableCourses] = useState<Course[]>([])

    // Unified Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        teeTime: '08:00',
        clubId: '',
        clubName: '',
        courseIdOut: '',
        courseNameOut: '',
        courseIdIn: '',
        courseNameIn: '',
        playTee: 'White',
        totalScore: '',
        isPublic: false,
        partners: '',
        partner1: '',
        partner2: '',
        partner3: '',
        memo: ''
    })

    // Score State
    const [scoreMode, setScoreMode] = useState<'simple' | 'detailed'>('simple')
    const [holeScores, setHoleScores] = useState<Record<number, string>>({}) // Key: 1-18 (Global Sequence)
    const [holeComments, setHoleComments] = useState<Record<number, string>>({}) // Key: 1-18
    const [courseHoles, setCourseHoles] = useState<any[]>([]) // Flattened list of hole data [1..18]

    // Conditions & Costs
    const [fees, setFees] = useState({ green: '', caddy: '', cart: '' })
    const [conditions, setConditions] = useState({
        weather: 'Sunny',
        temperature: '',
        windSpeed: 'Low',
        greenSpeed: '2.8',
        teeBox: 'excellent',
        fairwayRating: '3',
        greenRating: '3'
    })

    const [activeCommentHole, setActiveCommentHole] = useState<number>(0) // 0 for general memo, 1-18 for hole comments

    useEffect(() => {
        if (preFilledClubId && clubs.length > 0 && formData.clubId !== preFilledClubId) {
            const club = clubs.find(c => c.id === preFilledClubId)
            if (club) {
                // Manually trigger change
                // We recreate the event-like object or refactor handler
                setFormData(prev => ({
                    ...prev,
                    clubId: preFilledClubId,
                    clubName: club.name || ''
                }))
                fetchCoursesByClub(preFilledClubId).then(setAvailableCourses).catch(console.error)
            }
        }
    }, [preFilledClubId, clubs, fetchCoursesByClub])

    // Load holes when courses change
    useEffect(() => {
        const loadHoles = async () => {
            // Clear holes if no Front course selected
            if (!formData.courseIdOut) {
                if (courseHoles.length > 0) setCourseHoles([])
                if (Object.keys(holeScores).length > 0) setHoleScores({})
                setActiveCommentHole(0)
                return
            }

            let holesData: any[] = []

            // 1. Fetch Front Course Holes
            const c1Holes = await fetchHolesByCourse(formData.courseIdOut)
            if (c1Holes) holesData = [...c1Holes]

            // 2. Fetch Back Course Holes (if selected)
            if (formData.courseIdIn) {
                const c2Holes = await fetchHolesByCourse(formData.courseIdIn)
                if (c2Holes) holesData = [...holesData, ...c2Holes]
            }

            // Only update if data actually changed (basic length check or stringify check)
            if (JSON.stringify(holesData) !== JSON.stringify(courseHoles)) {
                setCourseHoles(holesData)
            }
        }
        loadHoles()
    }, [formData.courseIdOut, formData.courseIdIn, fetchHolesByCourse, courseHoles])

    // Update total score when hole scores change in detailed mode
    useEffect(() => {
        if (scoreMode === 'detailed') {
            const sum = Object.values(holeScores).reduce((acc, val) => acc + (Number(val) || 0), 0)
            const sumStr = sum > 0 ? sum.toString() : ''
            if (formData.totalScore !== sumStr) {
                setFormData(prev => ({ ...prev, totalScore: sumStr }))
            }
        }
    }, [holeScores, scoreMode, formData.totalScore])

    const handleClubChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value
        const club = clubs.find(c => c.id === id)

        setFormData(prev => ({
            ...prev,
            clubId: id,
            clubName: club?.name || '',
            courseIdOut: '',
            courseNameOut: '',
            courseIdIn: '',
            courseNameIn: '',
        }))
        setAvailableCourses([])
        setCourseHoles([])

        if (id) {
            try {
                const courses = await fetchCoursesByClub(id)
                setAvailableCourses(courses)
                // Auto-select first course? Maybe better to let user choose.
            } catch (err) {
                console.error(err)
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleHoleScoreChange = (holeIdx: number, val: string) => {
        // Limit 0-10
        let numVal = val.replace(/[^0-9]/g, '')
        if (numVal !== '') {
            let n = parseInt(numVal)
            if (n > 10) numVal = '10'
            if (n < 0) numVal = '0'
        }
        setHoleScores(prev => ({ ...prev, [holeIdx]: numVal }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !formData.clubId || !formData.courseIdOut || !formData.totalScore) {
            alert('필수 정보를 입력해주세요.')
            return
        }

        try {
            // Construct Course Data (Sequence Based)
            const coursesData = []

            // Sequence 1: Front
            const c1 = availableCourses.find(c => c.id === formData.courseIdOut)
            if (c1) {
                const c1HolesInput = []
                if (scoreMode === 'detailed') {
                    // Map global index 1..c1.holes to this course
                    for (let i = 1; i <= c1.holes; i++) {
                        const scoreVal = holeScores[i]
                        const par = courseHoles[i - 1]?.par || 4
                        if (scoreVal) {
                            c1HolesInput.push({
                                hole_no: i, // Relative to course
                                par: par,
                                score: Number(scoreVal),
                                hole_comment: holeComments[i] || ''
                            })
                        }
                    }
                }
                coursesData.push({
                    course_id: c1.id,
                    sequence: 1,
                    hole_start: 1,
                    hole_end: c1.holes,
                    holes_count: c1.holes,
                    holes: c1HolesInput
                })
            }

            // Sequence 2: Back (Optional)
            if (formData.courseIdIn) {
                const c2 = availableCourses.find(c => c.id === formData.courseIdIn)
                if (c2 && c1) {
                    const offset = c1.holes
                    const c2HolesInput = []
                    if (scoreMode === 'detailed') {
                        // Map global index offset+1..offset+c2.holes
                        for (let i = 1; i <= c2.holes; i++) {
                            const globalIdx = offset + i
                            const scoreVal = holeScores[globalIdx]
                            // courseHoles is flattened [c1 holes..., c2 holes...]
                            const par = courseHoles[globalIdx - 1]?.par || 4
                            if (scoreVal) {
                                c2HolesInput.push({
                                    hole_no: globalIdx,
                                    par: par,
                                    score: Number(scoreVal),
                                    hole_comment: holeComments[globalIdx] || ''
                                })
                            }
                        }
                    }
                    coursesData.push({
                        course_id: c2.id,
                        sequence: 2,
                        hole_start: offset + 1,
                        hole_end: offset + c2.holes,
                        holes_count: c2.holes,
                        holes: c2HolesInput
                    })
                }
            }

            const roundPayload = {
                round: {
                    user_id: user.id,
                    date: formData.date,
                    tee_time: formData.teeTime,
                    club_id: formData.clubId,
                    club_name: formData.clubName,
                    total_score: Number(formData.totalScore),
                    play_tee: formData.playTee,
                    is_public: formData.isPublic,

                    weather: conditions.weather,
                    temperature: conditions.temperature ? Number(conditions.temperature) : undefined,
                    wind_speed: conditions.windSpeed,
                    green_speed: conditions.greenSpeed ? Number(conditions.greenSpeed) : undefined,
                    tee_box_condition: conditions.teeBox,
                    fairway_rating: Number(conditions.fairwayRating),
                    green_rating: Number(conditions.greenRating),

                    green_fee: fees.green ? Number(unformatNumber(fees.green)) : undefined,
                    caddy_fee: fees.caddy ? Number(unformatNumber(fees.caddy)) : undefined,
                    cart_fee: fees.cart ? Number(unformatNumber(fees.cart)) : undefined,
                    total_cost: (Number(unformatNumber(fees.green || '0')) + Number(unformatNumber(fees.caddy || '0')) + Number(unformatNumber(fees.cart || '0'))) || undefined,

                    partners: [formData.partner1, formData.partner2, formData.partner3].filter(Boolean).join(', ') || formData.partners,
                    memo: formData.memo
                },
                courses: coursesData
            }

            await createRound(roundPayload as any)
            router.push('/')

        } catch (err) {
            console.error(err)
            alert('저장 중 오류가 발생했습니다.')
        }
    }

    return (
        <div style={{ paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
            <style jsx global>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => router.back()} style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={24} color="var(--color-text-muted)" />
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>라운드 기록</h1>
            </div>

            {/* Tab Nav (Segment Control Style) */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '32px',
                background: 'white',
                padding: '6px',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <button
                    onClick={() => setActiveTab('essential')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        transition: 'all 0.2s',
                        background: activeTab === 'essential' ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === 'essential' ? 'white' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Save size={18} />
                    기본 정보
                </button>
                <button
                    onClick={() => setActiveTab('detail')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        transition: 'all 0.2s',
                        background: activeTab === 'detail' ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === 'detail' ? 'white' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Plus size={18} />
                    상세 정보
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: activeTab === 'essential' ? 'block' : 'none' }}>
                    <Card title="일정 및 골프장" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <Input label="날짜" type="date" name="date" value={formData.date} onChange={handleChange} required />
                            <Input label="티타임" type="time" name="teeTime" value={formData.teeTime} onChange={handleChange} required />
                        </div>
                        <Select
                            label="골프장"
                            name="clubId"
                            value={formData.clubId}
                            onChange={handleClubChange}
                            options={[{ label: '골프장 선택', value: '' }, ...clubs.map(c => ({ label: c.name, value: c.id }))]}
                            required
                        />
                    </Card>

                    {formData.clubId && availableCourses.length > 0 && (
                        <Card title="코스 선택" style={{ marginBottom: '24px' }}>
                            {/* Front Selection */}
                            <div style={{ marginBottom: '16px' }}>
                                <Select
                                    label="전반 코스"
                                    name="courseIdOut"
                                    value={formData.courseIdOut}
                                    onChange={(e) => {
                                        const c = availableCourses.find(x => x.id === e.target.value)
                                        setFormData(prev => ({
                                            ...prev,
                                            courseIdOut: e.target.value,
                                            courseNameOut: c?.name || '',
                                            // Auto-clear Back if Front is 18 holes
                                            ...(c?.holes === 18 ? { courseIdIn: '', courseNameIn: '' } : {})
                                        }))
                                    }}
                                    options={[{ label: '코스 선택', value: '' }, ...availableCourses.map(c => ({ label: `${c.name} (${c.holes}홀)`, value: c.id }))]}
                                    required
                                />
                            </div>

                            {/* Back Selection - Conditional */}
                            <div style={{ marginBottom: '16px', opacity: (availableCourses.find(c => c.id === formData.courseIdOut)?.holes === 18) ? 0.5 : 1 }}>
                                <Select
                                    label="후반 코스"
                                    name="courseIdIn"
                                    value={formData.courseIdIn}
                                    disabled={availableCourses.find(c => c.id === formData.courseIdOut)?.holes === 18}
                                    onChange={(e) => {
                                        const c = availableCourses.find(x => x.id === e.target.value)
                                        setFormData(prev => ({ ...prev, courseIdIn: e.target.value, courseNameIn: c?.name || '' }))
                                    }}
                                    options={[
                                        { label: '코스 선택', value: '' },
                                        ...availableCourses.map(c => ({ label: `${c.name} (${c.holes}홀)`, value: c.id }))
                                    ]}
                                />
                            </div>

                            <Select
                                label="티 박스 (Play Tee)"
                                name="playTee"
                                value={formData.playTee}
                                onChange={handleChange}
                                options={[
                                    { label: 'White (Regular)', value: 'White' },
                                    { label: 'Red (Ladies)', value: 'Red' },
                                    { label: 'Black (Back)', value: 'Black' },
                                    { label: 'Blue (Champ)', value: 'Blue' },
                                    { label: 'Yellow', value: 'Yellow' }
                                ]}
                            />
                        </Card>
                    )}

                    <Card title="스코어" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--color-bg-light)', padding: '4px', borderRadius: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setScoreMode('simple')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    transition: 'all 0.2s',
                                    background: scoreMode === 'simple' ? 'white' : 'transparent',
                                    color: scoreMode === 'simple' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    boxShadow: scoreMode === 'simple' ? 'var(--shadow-sm)' : 'none'
                                }}
                            >간편 입력</button>
                            <button
                                type="button"
                                onClick={() => setScoreMode('detailed')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    transition: 'all 0.2s',
                                    background: scoreMode === 'detailed' ? 'white' : 'transparent',
                                    color: scoreMode === 'detailed' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    boxShadow: scoreMode === 'detailed' ? 'var(--shadow-sm)' : 'none'
                                }}
                            >상세 입력</button>
                        </div>

                        {scoreMode === 'simple' ? (
                            <div style={{ padding: '10px 0' }}>
                                <Input
                                    type="number"
                                    name="totalScore"
                                    value={formData.totalScore}
                                    onChange={handleChange}
                                    placeholder="최종 타수를 입력해주세요"
                                    style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', height: '60px', borderRadius: '16px' }}
                                />
                                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '12px' }}>
                                    최종 타수를 입력해주세요
                                </p>
                            </div>
                        ) : (
                            <div>
                                {courseHoles.length === 0 ? (
                                    <div style={{ padding: '32px', textAlign: 'center', background: 'var(--color-bg-light)', borderRadius: '16px', color: 'var(--color-text-muted)' }}>
                                        <Info size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>코스를 먼저 선택해주세요.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto', paddingBottom: '8px' }} className="scrollbar-hide">
                                        <div style={{ minWidth: '400px' }}>
                                            {/* Headers */}
                                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${courseHoles.length}, 1fr)`, gap: '4px', marginBottom: '12px' }}>
                                                {courseHoles.map((h, i) => (
                                                    <div key={i} style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)' }}>{i + 1}</div>
                                                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#AAA' }}>P{h.par}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Inputs */}
                                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${courseHoles.length}, 1fr)`, gap: '4px' }}>
                                                {courseHoles.map((h, i) => (
                                                    <input
                                                        key={i}
                                                        type="number"
                                                        inputMode="numeric"
                                                        min="0"
                                                        max="10"
                                                        value={holeScores[i + 1] || ''}
                                                        onChange={(e) => handleHoleScoreChange(i + 1, e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            height: '40px',
                                                            textAlign: 'center',
                                                            padding: 0,
                                                            border: '1px solid var(--color-border)',
                                                            borderRadius: '8px',
                                                            fontSize: '1rem',
                                                            fontWeight: 900,
                                                            background: holeScores[i + 1] ? 'var(--color-primary-lighter)' : 'white',
                                                            color: holeScores[i + 1] ? 'var(--color-primary)' : 'var(--color-text-main)',
                                                            outline: 'none',
                                                            transition: 'all 0.2s',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            lineHeight: '40px'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '8px', marginTop: '20px', padding: '12px 0 0', borderTop: '1px dashed var(--color-border)' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>TOTAL</span>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>{formData.totalScore || 0}</span>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '16px 20px', marginBottom: '24px' }}>
                        <Switch
                            checked={formData.isPublic}
                            onChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                            label="커뮤니티에 이 라운드 공개하기"
                        />
                        <p style={{ marginLeft: '56px', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            공개 시 대시보드 실시간 커뮤니티에 노출됩니다.
                        </p>
                    </div>

                    <Button type="submit" style={{ width: '100%', height: '60px', fontSize: '1.2rem', fontWeight: 800, justifyContent: 'center', borderRadius: '20px', boxShadow: '0 10px 20px -5px rgba(76, 175, 80, 0.3)' }}>
                        <Save size={24} style={{ marginRight: 10 }} />
                        기록 완료하기
                    </Button>
                </div>

                {/* Detail Tab Content */}
                <div style={{ display: activeTab === 'detail' ? 'block' : 'none' }}>
                    <Card title="비용 정보" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            <Input label="그린피" type="text" value={fees.green} onChange={e => setFees(prev => ({ ...prev, green: formatNumber(e.target.value) }))} placeholder="0" />
                            <Input label="캐디피" type="text" value={fees.caddy} onChange={e => setFees(prev => ({ ...prev, caddy: formatNumber(e.target.value) }))} placeholder="0" />
                            <Input label="카트비" type="text" value={fees.cart} onChange={e => setFees(prev => ({ ...prev, cart: formatNumber(e.target.value) }))} placeholder="0" />
                        </div>
                    </Card>
                    <Card title="구장 환경 & 메모" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <Select
                                label="날씨"
                                value={conditions.weather}
                                onChange={e => setConditions(prev => ({ ...prev, weather: e.target.value }))}
                                options={['Sunny', 'Cloudy', 'Rainy', 'Windy'].map(x => ({ label: x, value: x }))}
                            />
                            <Input label="온도(°C)" type="number" value={conditions.temperature} onChange={e => setConditions(prev => ({ ...prev, temperature: e.target.value }))} placeholder="25" />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>구장 상태 평가</label>

                            {/* Row 1: Teeing Ground */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#999', marginBottom: '4px' }}>티잉그라운드</div>
                                <Select
                                    value={conditions.teeBox}
                                    onChange={e => setConditions(prev => ({ ...prev, teeBox: e.target.value }))}
                                    options={[
                                        { label: '최상', value: 'excellent' },
                                        { label: '보통', value: 'good' },
                                        { label: '불량', value: 'poor' }
                                    ]}
                                />
                            </div>

                            {/* Row 2: Fairway and Green */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ background: 'var(--color-bg-light)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#999', marginBottom: '8px', textAlign: 'center' }}>페어웨이</div>
                                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={18}
                                                fill={star <= Number(conditions.fairwayRating) ? 'var(--color-primary)' : 'none'}
                                                color={star <= Number(conditions.fairwayRating) ? 'var(--color-primary)' : '#DDD'}
                                                onClick={() => setConditions(prev => ({ ...prev, fairwayRating: star.toString() }))}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div style={{ background: 'var(--color-bg-light)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#999', marginBottom: '8px', textAlign: 'center' }}>그린</div>
                                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={18}
                                                fill={star <= Number(conditions.greenRating) ? 'var(--color-primary)' : 'none'}
                                                color={star <= Number(conditions.greenRating) ? 'var(--color-primary)' : '#DDD'}
                                                onClick={() => setConditions(prev => ({ ...prev, greenRating: star.toString() }))}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--color-bg-light)', borderRadius: '12px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>라운드 & 홀별 코멘트</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
                                <Select
                                    value={activeCommentHole.toString()}
                                    onChange={(e) => setActiveCommentHole(parseInt(e.target.value))}
                                    options={[
                                        { label: '전체', value: '0' },
                                        ...(courseHoles.length > 0
                                            ? courseHoles.map((_, i) => ({ label: `${i + 1}홀`, value: (i + 1).toString() }))
                                            : []
                                        )
                                    ]}
                                />
                                <Input
                                    placeholder={activeCommentHole === 0 ? "전체적인 라운드 코멘트" : `${activeCommentHole}번 홀 코멘트`}
                                    value={activeCommentHole === 0 ? formData.memo : (holeComments[activeCommentHole] || '')}
                                    onChange={(e) => {
                                        if (activeCommentHole === 0) {
                                            setFormData(prev => ({ ...prev, memo: e.target.value }))
                                        } else {
                                            setHoleComments(prev => ({ ...prev, [activeCommentHole]: e.target.value }))
                                        }
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                                {activeCommentHole === 0 ? '라운드 전체에 대한 코멘트를 작성중입니다.' : `${activeCommentHole}번 홀에 대한 상세 코멘트를 작성중입니다.`}
                                {courseHoles.length === 0 && activeCommentHole === 0 && ' (코스를 선택하면 홀별 코멘트를 남길 수 있습니다)'}
                            </p>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>동반자 (최대 3명)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                <Input
                                    name="partner1"
                                    value={formData.partner1}
                                    onChange={handleChange}
                                    placeholder="동반자 1"
                                />
                                <Input
                                    name="partner2"
                                    value={formData.partner2}
                                    onChange={handleChange}
                                    placeholder="동반자 2"
                                />
                                <Input
                                    name="partner3"
                                    value={formData.partner3}
                                    onChange={handleChange}
                                    placeholder="동반자 3"
                                />
                            </div>
                        </div>
                    </Card>
                    <Button type="button" variant="outline" onClick={() => setActiveTab('essential')} style={{ width: '100%', height: '54px', marginBottom: '12px', justifyContent: 'center', borderRadius: '16px' }}>
                        기본 정보로 돌아가기
                    </Button>
                    <Button type="submit" style={{ width: '100%', height: '60px', fontSize: '1.2rem', fontWeight: 800, justifyContent: 'center', borderRadius: '20px', boxShadow: '0 10px 20px -5px rgba(76, 175, 80, 0.3)' }}>
                        <Save size={24} style={{ marginRight: 10 }} />
                        기록 완료하기
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default function LogRound() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LogRoundContent />
        </Suspense>
    )
}
