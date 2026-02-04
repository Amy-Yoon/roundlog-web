'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Info, MoreHorizontal } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useRounds } from '@/hooks/useRounds'
import { useClubs, Club, Course } from '@/hooks/useClubs'
import { useAuth } from '@/contexts/AuthContext'
import { RoundInsert } from '@/types/database.types'

export default function LogRound() {
    const router = useRouter()
    const { createRound } = useRounds()
    const { clubs, fetchCoursesByClub } = useClubs()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'essential' | 'detail'>('essential')
    const [availableCourses, setAvailableCourses] = useState<Course[]>([])

    const [formData, setFormData] = useState<any>({
        // Essential
        date: new Date().toISOString().split('T')[0],
        teeTime: '08:00',
        clubId: '',
        clubName: '',
        courseId: '',
        courseName: '',
        totalScore: '',
        isPublic: false,

        // Optional - Detail
        weather: 'Sunny',
        temperature: '',
        windSpeed: 'Low',

        greenSpeed: '2.8',
        teeBoxCondition: 'well_maintained_grass',
        fairwayRating: '3',
        greenRating: '3',

        greenFee: '',
        caddyFee: '',
        cartFee: '',

        partners: '',
        memo: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleClubChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clubId = e.target.value
        const club = clubs.find(c => c.id === clubId)

        if (clubId) {
            try {
                const courses = await fetchCoursesByClub(clubId)
                setAvailableCourses(courses)
                const firstCourse = courses[0]

                setFormData((prev: any) => ({
                    ...prev,
                    clubId: clubId,
                    clubName: club ? club.name : '',
                    courseId: firstCourse?.id || '',
                    courseName: firstCourse?.name || ''
                }))
            } catch (err) {
                console.error("Failed to fetch courses", err)
            }
        } else {
            setAvailableCourses([])
            setFormData((prev: any) => ({
                ...prev,
                clubId: '',
                clubName: '',
                courseId: '',
                courseName: ''
            }))
        }
    }

    const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const courseId = e.target.value
        const course = availableCourses.find(c => c.id === courseId)

        setFormData((prev: any) => ({
            ...prev,
            courseId: courseId,
            courseName: course ? course.name : ''
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (!formData.clubName || !formData.totalScore) {
            alert("골프장과 스코어는 필수 입력 항목입니다.")
            return
        }

        try {
            // Transform form data to match real DB schema (snake_case)
            const roundData: RoundInsert = {
                user_id: user.id,
                date: formData.date,
                tee_time: formData.teeTime,
                club_id: formData.clubId,
                club_name: formData.clubName,
                course_id: formData.courseId || formData.clubId, // Fallback if simple structure
                course_name: formData.courseName,
                total_score: Number(formData.totalScore),
                is_public: formData.isPublic,

                // Optional fields
                weather: formData.weather,
                temperature: formData.temperature ? Number(formData.temperature) : undefined,
                wind_speed: formData.windSpeed,

                green_speed: formData.greenSpeed ? Number(formData.greenSpeed) : undefined,
                tee_box_condition: formData.teeBoxCondition,
                fairway_rating: Number(formData.fairwayRating),
                green_rating: Number(formData.greenRating),

                green_fee: formData.greenFee ? Number(formData.greenFee) : undefined,
                caddy_fee: formData.caddyFee ? Number(formData.caddyFee) : undefined,
                cart_fee: formData.cartFee ? Number(formData.cartFee) : undefined,
                // total_cost could be calculated here or in DB trigger
                total_cost: (Number(formData.greenFee || 0) + Number(formData.caddyFee || 0) + Number(formData.cartFee || 0)) || undefined,

                partners: formData.partners,
                memo: formData.memo,
            }

            await createRound(roundData)
            router.push('/')
        } catch (error) {
            console.error('Failed to save round', error)
            alert('저장 중 오류가 발생했습니다.')
        }
    }

    return (
        <div style={{ paddingBottom: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <button onClick={() => router.back()} style={{ marginRight: '10px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>라운드 기록</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => setActiveTab('essential')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'essential' ? '2px solid var(--color-primary)' : 'none',
                        color: activeTab === 'essential' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        fontWeight: activeTab === 'essential' ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <Info size={18} />
                    필수 정보
                </button>
                <button
                    onClick={() => setActiveTab('detail')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'detail' ? '2px solid var(--color-primary)' : 'none',
                        color: activeTab === 'detail' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        fontWeight: activeTab === 'detail' ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <MoreHorizontal size={18} />
                    상세 정보 (선택)
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* ---------------- ESSENTIAL TAB ---------------- */}
                <div style={{ display: activeTab === 'essential' ? 'block' : 'none' }}>
                    <Card title="날짜 및 시간" className="mb-6">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Input label="날짜" type="date" name="date" value={formData.date} onChange={handleChange} required />
                            <Input label="티타임" type="time" name="teeTime" value={formData.teeTime} onChange={handleChange} required />
                        </div>
                    </Card>

                    <Card title="골프장 정보" className="mb-6">
                        <Select
                            label="골프장 선택"
                            name="clubId"
                            value={formData.clubId}
                            onChange={handleClubChange}
                            options={[
                                { label: '골프장 선택', value: '' },
                                ...clubs.map(c => ({ label: c.name, value: c.id }))
                            ]}
                            required
                        />

                        {availableCourses.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                                <Select
                                    label="코스 선택"
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleCourseChange}
                                    options={
                                        availableCourses.map(sub => ({ label: sub.name, value: sub.id }))
                                    }
                                    disabled={!formData.clubId}
                                />
                            </div>
                        )}
                    </Card>

                    <Card title="스코어" className="mb-6">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    label="총 타수 (Total Score)"
                                    type="number"
                                    placeholder="예: 85"
                                    name="totalScore"
                                    value={formData.totalScore}
                                    onChange={handleChange}
                                    required
                                    style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                                />
                            </div>
                        </div>
                        <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            * 상세 홀별 스코어는 기록 저장 후 상세 페이지에서 입력할 수 있습니다.
                        </p>
                    </Card>

                    <div style={{ marginTop: '30px' }}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab('detail')}
                            style={{ width: '100%', padding: '14px', justifyContent: 'center', marginBottom: '12px' }}
                        >
                            상세 정보도 입력하기 (선택)
                        </Button>
                        <Button type="submit" style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '1.1rem' }}>
                            <Save size={20} style={{ marginRight: 8 }} />
                            저장하기
                        </Button>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, isPublic: e.target.checked }))}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <label htmlFor="isPublic" style={{ fontSize: '0.95rem', cursor: 'pointer', userSelect: 'none' }}>
                            커뮤니티에 공개하기 (실시간 대시보드 노출)
                        </label>
                    </div>
                </div>

                {/* ---------------- DETAIL TAB ---------------- */}
                <div style={{ display: activeTab === 'detail' ? 'block' : 'none' }}>
                    <Card title="비용 (1인 기준)" className="mb-6">
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '15px', background: 'var(--color-bg-light)', padding: '10px', borderRadius: '6px' }}>
                            💡 본인이 실제로 부담한 금액만 입력하세요.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            <Input label="그린피" type="number" placeholder="0" name="greenFee" value={formData.greenFee} onChange={handleChange} />
                            <Input label="캐디피" type="number" placeholder="0" name="caddyFee" value={formData.caddyFee} onChange={handleChange} />
                            <Input label="카트비" type="number" placeholder="0" name="cartFee" value={formData.cartFee} onChange={handleChange} />
                        </div>
                        {(formData.greenFee || formData.caddyFee || formData.cartFee) && (
                            <div style={{ marginTop: '12px', textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)' }}>
                                합계: ₩{(Number(formData.greenFee || 0) + Number(formData.caddyFee || 0) + Number(formData.cartFee || 0)).toLocaleString()}
                            </div>
                        )}
                    </Card>

                    <Card title="환경 & 날씨" className="mb-6">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Select
                                label="날씨"
                                name="weather"
                                value={formData.weather}
                                onChange={handleChange}
                                options={[
                                    { label: '맑음', value: 'Sunny' },
                                    { label: '흐림', value: 'Cloudy' },
                                    { label: '비', value: 'Rainy' },
                                    { label: '바람', value: 'Windy' },
                                    { label: '눈', value: 'Snowy' }
                                ]}
                            />
                            <Input label="기온 (°C)" type="number" placeholder="25" name="temperature" value={formData.temperature} onChange={handleChange} />
                        </div>
                    </Card>

                    <Card title="코스 컨디션" className="mb-6">
                        <div style={{ marginBottom: '12px' }}>
                            <Input
                                label="그린 스피드"
                                type="number"
                                step="0.1"
                                placeholder="2.8"
                                name="greenSpeed"
                                value={formData.greenSpeed}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Select
                                label="페어웨이"
                                name="fairwayRating"
                                value={formData.fairwayRating}
                                onChange={handleChange}
                                options={[
                                    { label: '3점 (보통)', value: '3' },
                                    { label: '1점 (나쁨)', value: '1' },
                                    { label: '2점', value: '2' },
                                    { label: '4점', value: '4' },
                                    { label: '5점 (최상)', value: '5' }
                                ]}
                            />
                            <Select
                                label="그린"
                                name="greenRating"
                                value={formData.greenRating}
                                onChange={handleChange}
                                options={[
                                    { label: '3점 (보통)', value: '3' },
                                    { label: '1점 (나쁨)', value: '1' },
                                    { label: '2점', value: '2' },
                                    { label: '4점', value: '4' },
                                    { label: '5점 (최상)', value: '5' }
                                ]}
                            />
                        </div>
                    </Card>

                    <Card title="동반자 & 메모" className="mb-6">
                        <Input label="동반자" placeholder="함께한 사람들" name="partners" value={formData.partners} onChange={handleChange} />
                        <div style={{ height: '10px' }} />
                        <Input label="메모" placeholder="오늘의 라운드 후기..." name="memo" value={formData.memo} onChange={handleChange} />
                    </Card>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setActiveTab('essential')}
                            style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
                        >
                            이전 (필수 정보)
                        </Button>
                        <Button type="submit" style={{ flex: 2, padding: '14px', justifyContent: 'center', fontSize: '1.1rem' }}>
                            <Save size={20} style={{ marginRight: 8 }} />
                            저장하기
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
