'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronRight, Star, Loader2, ArrowUpDown } from 'lucide-react'
import Input from '@/components/ui/Input'
import { useClubs, SortOption } from '@/hooks/useClubs'
import { useAuth } from '@/contexts/AuthContext'

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-bright)' }}>{course.name}</div>
                        {course.club_type && (
                            <span style={{
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: (course.club_type === '회원제' || course.club_type === 'Membership') ? '#FEF2F2' : '#EFF6FF',
                                color: (course.club_type === '회원제' || course.club_type === 'Membership') ? '#DC2626' : '#2563EB',
                                border: `1px solid ${(course.club_type === '회원제' || course.club_type === 'Membership') ? '#FCA5A5' : '#BFDBFE'}`,
                                letterSpacing: '-0.02em',
                                whiteSpace: 'nowrap'
                            }}>
                                {course.club_type}
                            </span>
                        )}
                    </div>
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
    const { user } = useAuth()
    const { clubs, loading, loadingMore, error, hasMore, sortBy, searchTerm, onlyPlayed, loadMore, changeSort, toggleOnlyPlayed, search } = useClubs(10)
    const observer = useRef<IntersectionObserver | null>(null)
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || loadingMore) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore()
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, loadingMore, hasMore, loadMore])

    const sortOptions: { value: SortOption, label: string }[] = [
        { value: 'recommended', label: '추천순' },
        { value: 'name', label: '이름순' },
        { value: 'location', label: '위치순' },
        { value: 'holes', label: '홀 많은 순' },
        { value: 'rating', label: '평점 높은 순' }
    ]

    return (
        <div style={{ paddingBottom: '80px' }}>
            <h1 style={{ marginBottom: '20px', fontSize: 'var(--h2-size)' }}>코스 목록</h1>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 1, pointerEvents: 'none' }} />
                    <Input
                        placeholder="골프장 이름 또는 지역 검색"
                        value={searchTerm}
                        onChange={(e) => search(e.target.value)}
                        style={{ paddingLeft: '40px', marginBottom: 0 }}
                    />
                </div>
                {/* Only show filter button when logged in */}
                {user && (
                    <button
                        onClick={toggleOnlyPlayed}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            background: onlyPlayed ? 'var(--color-primary)' : 'white',
                            color: onlyPlayed ? 'white' : 'var(--color-text-muted)',
                            border: `1px solid ${onlyPlayed ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        내가 간 코스
                    </button>
                )}
            </div>

            {/* Sorting UI */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {sortOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => changeSort(option.value)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '16px',
                            background: sortBy === option.value ? 'var(--color-primary)' : 'white',
                            color: sortBy === option.value ? 'white' : 'var(--color-text-muted)',
                            border: `1px solid ${sortBy === option.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        {sortBy === option.value && <ArrowUpDown size={14} />}
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: '200px', display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                {loading && clubs.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <Loader2 className="animate-spin" color="var(--color-primary)" />
                    </div>
                ) : clubs.length > 0 ? (
                    <>
                        {clubs.map((club, index) => (
                            <div key={club.id} ref={index === clubs.length - 1 ? lastElementRef : null}>
                                <CourseItem course={club} onClick={() => router.push(`/courses/${club.id}`)} />
                            </div>
                        ))}
                        {loadingMore && (
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                                <Loader2 className="animate-spin" size={20} color="var(--color-primary)" />
                            </div>
                        )}
                    </>
                ) : !loading && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <p>검색 결과가 없어요.</p>
                    </div>
                )}
            </div>

            {error && (
                <div style={{ marginTop: '20px', padding: '16px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}
        </div>
    )
}
