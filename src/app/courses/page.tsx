'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronRight, Star, Loader2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import { useClubs } from '@/hooks/useClubs'

const CourseItem = ({ course, onClick }: { course: any, onClick: () => void }) => {
    const [isHovered, setIsHovered] = React.useState(false)

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: isHovered ? 'var(--color-bg-light)' : 'white',
                borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'background 0.2s'
            }}
        >
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{
                    width: '50px', height: '50px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '1.2rem'
                }}>
                    {course.name[0]}
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px', color: 'var(--color-text-bright)' }}>{course.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MapPin size={12} /> {course.location}</span>
                        <span style={{ width: '3px', height: '3px', background: 'var(--color-text-muted)', borderRadius: '50%', opacity: 0.5 }}></span>
                        <span>{course.hole_count ? `${course.hole_count}홀` : '-'}</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FFF5E6', padding: '4px 10px', borderRadius: '12px' }}>
                    <Star size={16} fill="#FF9800" color="#FF9800" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FF9800' }}>4.5</span>
                </div>
                <ChevronRight size={20} color="var(--color-text-muted)" />
            </div>
        </div>
    )
}

export default function CourseList() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const { clubs, loading, error } = useClubs()

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-danger)' }}>데이터를 불러오는 중 오류가 발생했습니다: {error}</p>
            </div>
        )
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>코스 목록</h1>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 1, pointerEvents: 'none' }} />
                <Input
                    placeholder="골프장 이름 또는 지역 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                />
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <Loader2 className="animate-spin" color="var(--color-primary)" />
                    </div>
                ) : filteredClubs.length > 0 ? (
                    filteredClubs.map(club => (
                        <CourseItem key={club.id} course={club} onClick={() => router.push(`/courses/${club.id}`)} />
                    ))
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <p>검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
