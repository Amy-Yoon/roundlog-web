'use client'

import React, { useMemo } from 'react'

export const dynamic = 'force-dynamic'
import { useRounds } from '@/hooks/useRounds'
import Card from '@/components/ui/Card'
import { TrendingUp, Sun } from 'lucide-react'

export default function Analysis() {
    const { rounds } = useRounds()

    // Stats Calculation
    const stats: any = useMemo(() => {
        if (!rounds || rounds.length === 0) return null

        const scores = rounds.map(r => Number(r.total_score))
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        const bestScore = Math.min(...scores)

        // Recent 10 rounds for trend
        const recentRounds = [...rounds].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-10)

        // Weather Stats
        const weatherStats = rounds.reduce((acc: any, curr) => {
            const w = curr.weather || 'Unknown'
            if (!acc[w]) acc[w] = { total: 0, count: 0 }
            acc[w].total += Number(curr.total_score)
            acc[w].count += 1
            return acc
        }, {})

        const bestWeather = Object.entries(weatherStats)
            .map(([key, val]: [string, any]) => ({ weather: key, avg: val.total / val.count }))
            .sort((a, b) => a.avg - b.avg)[0]

        return { avgScore, bestScore, recentRounds, bestWeather }
    }, [rounds])

    if (!stats) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>분석</h1>
                <p>데이터가 충분하지 않습니다. 라운드를 기록해보세요!</p>
            </div>
        )
    }

    return (
        <div className="page-transition" style={{ paddingBottom: '80px' }}>
            <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>퍼포먼스 분석</h1>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: 'var(--spacing-lg)', marginTop: '20px' }}>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--color-accent)', filter: 'blur(30px)', opacity: 0.3 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px', zIndex: 1 }}>평균 스코어</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', zIndex: 1 }}>
                        {stats.avgScore}
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--color-warning)', filter: 'blur(30px)', opacity: 0.3 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px', zIndex: 1 }}>베스트 스코어</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-secondary)', zIndex: 1 }}>
                        {stats.bestScore}
                    </div>
                </div>
            </div>

            {/* Score Trend Graph */}
            <Card title="스코어 트렌드 (최근 10경기)">
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '30px', paddingBottom: '10px' }}>
                    {stats.recentRounds.map((r: any, i: number) => {
                        // Normalize height: Min 60, Max 120 maps to height percentages
                        const score = Number(r.total_score || r.score)
                        const height = Math.max(10, Math.min(100, ((120 - score) / 50) * 100))
                        return (
                            <div key={r.id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '5px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>{score}</span>
                                <div style={{
                                    width: '6px',
                                    height: `${height}%`,
                                    background: 'linear-gradient(to top, var(--color-accent), var(--color-primary-light))',
                                    borderRadius: '4px',
                                    transition: 'height 1s ease-out'
                                }} />
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{i + 1}</span>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Insight Card */}
            <Card style={{ marginTop: 'var(--spacing-md)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '15px', color: 'var(--color-text-bright)' }}>
                    💡 인사이트
                </h3>
                {stats.bestWeather && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#FFF5E6', borderRadius: '12px', border: '1px solid #FFE6CC' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFE6CC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sun size={24} color="#FF9800" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>최고의 컨디션</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-bright)' }}>
                                <span style={{ color: '#FF9800', fontWeight: 700 }}>{stats.bestWeather.weather}</span> 날씨에 평균 <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{Math.round(stats.bestWeather.avg)}타</span>로 가장 잘 쳤어요!
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
