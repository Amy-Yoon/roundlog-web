'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, MapPin, ChevronRight, Trophy } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useRounds } from '@/hooks/useRounds'
import { usePublicRounds } from '@/hooks/usePublicRounds'

// StatCard Component
const StatCard = ({ title, value, subtext, accent }: { title: string, value: string | number, subtext?: string, accent?: boolean }) => (
  <div className="glass-card" style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0', color: accent ? 'var(--color-accent)' : 'var(--color-text-main)' }}>{value}</div>
    {subtext && <span style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.5)' }}>{subtext}</span>}
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const { rounds: userRounds } = useRounds()
  const { rounds: publicRounds, loading: publicLoading } = usePublicRounds()
  const router = useRouter()

  // Stats Calculation (Only for Logged In User)
  const totalRounds = userRounds.length

  const avgScore = totalRounds > 0
    ? Math.round(userRounds.reduce((acc, curr) => acc + Number(curr.total_score), 0) / totalRounds)
    : '-'

  const bestScore = totalRounds > 0
    ? Math.min(...userRounds.map(r => Number(r.total_score)))
    : '-'

  // Data Source: Personal or Public
  // Need to adapt types as Public rounds have userName, Personal rounds don't (in context of list)
  const roundData: any[] = user ? userRounds : publicRounds

  const recentRounds = [...roundData]
    //.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Already sorted by DB query
    .slice(0, 5)

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>
          {user ? '개요' : '커뮤니티 라운드'}
        </h1>
      </div>

      {/* Login Prompt Banner (Logged Out Only) */}
      {!user && (
        <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%)', color: 'white' }}>
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '8px' }}>RoundLog와 함께하세요!</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '0', opacity: 0.9 }}>
              내 라운드를 기록하고 통계를 확인해보세요.
            </p>
          </div>
        </Card>
      )}

      {/* Stats Row (Logged In Only) */}
      {user && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          <StatCard title="라운드" value={totalRounds} />
          <StatCard title="평균 타수" value={avgScore} accent />
          <StatCard title="베스트" value={bestScore} />
        </div>
      )}

      {/* Recent Rounds Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
          {user ? '최근 라운드' : '실시간 커뮤니티'}
        </h2>
        <span className="btn-text-link" onClick={() => router.push('/rounds')} style={{ cursor: 'pointer' }}>전체보기</span>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {recentRounds.length > 0 ? (
          recentRounds.map(round => (
            <div key={round.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', background: 'white', // removed transparency for cleaner look, or keep transparent if glass
              borderBottom: '1px solid var(--color-border)',
              cursor: user ? 'pointer' : 'default',
              transition: 'background 0.2s',
            }}
              className="hover:bg-gray-50"
              onClick={() => user && router.push(`/rounds/${round.id}`)}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {/* Line 1: Main Title (Course) */}
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {round.course_name}
                </div>

                {/* Line 2: Metadata (Date | Type | User) */}
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{round.date.replace(/-/g, '.')}</span>
                  <span style={{ width: '1px', height: '10px', background: 'var(--color-border)' }}></span>
                  <span>{round.club_name}</span>
                  {!user && (
                    <>
                      <span style={{ width: '1px', height: '10px', background: 'var(--color-border)' }}></span>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                        {/* 
                           Public rounds usually don't have joined user info in this simple query unless we join.
                           But for now, show 'User' or verify if we can fetch it. 
                           The SQL setup inserted dummy user. 
                        */}
                        {'Golfer'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Side: Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-light)',
                  fontSize: '1.2rem', fontWeight: 800,
                  color: 'var(--color-text-main)'
                }}>
                  {round.total_score}
                </div>
                {user && <ChevronRight size={18} color="var(--color-text-muted)" />}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Trophy size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>기록된 라운드가 없습니다.</p>
            {user && (
              <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => router.push('/rounds/new')}>
                첫 라운드 기록하기
              </Button>
            )}
          </div>
        )}
      </div>

      {/* FAB (Logged In Only) */}
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
