'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, MapPin, ChevronRight, Trophy, Calendar, Calendar as CalendarIcon } from 'lucide-react'
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

  // Community Stats (For Logged Out)
  const [communityStats, setCommunityStats] = React.useState({ totalUsers: 0, totalRounds: 0, avgScore: 0 })

  React.useEffect(() => {
    if (!user) {
      const fetchCommunityStats = async () => {
        try {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()

          // 1. Total Users
          const { count: totalUsersCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })

          // 2. Total Rounds
          const { data: roundsData, count: totalRoundsCount } = await supabase
            .from('rounds')
            .select('total_score', { count: 'exact' })

          const scores = (roundsData as any[] || []).map(r => Number(r.total_score)).filter(s => !isNaN(s))
          const avgScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0

          setCommunityStats({
            totalUsers: totalUsersCount || 0,
            totalRounds: totalRoundsCount || 0,
            avgScore
          })
        } catch (err) {
          console.error('Error fetching community stats:', err)
        }
      }
      fetchCommunityStats()
    }
  }, [user])

  // Stats Calculation (Only for Logged In User)
  const totalRounds = userRounds.length

  const avgScore = totalRounds > 0
    ? Math.round(userRounds.reduce((acc, curr) => acc + Number(curr.total_score), 0) / totalRounds)
    : '-'

  const bestScore = totalRounds > 0
    ? Math.min(...userRounds.map(r => Number(r.total_score)))
    : '-'

  // Data Source: Personal or Public
  const roundData: any[] = user ? userRounds : publicRounds

  // Group rounds by club_id + date (one round per golf club visit)
  const groupedRounds = React.useMemo(() => {
    const groups: Record<string, any> = {}

    roundData.forEach(round => {
      const key = `${round.club_id}_${round.date}_${round.user_id}`
      if (!groups[key]) {
        groups[key] = {
          id: round.id, // Use first round's ID for navigation
          club_id: round.club_id,
          club_name: round.club_name,
          date: round.date,
          user_id: round.user_id,
          courses: [],
          total_score: 0
        }
      }
      if (round.round_courses && round.round_courses.length > 0) {
        round.round_courses.forEach((rc: any) => {
          groups[key].courses.push({
            course_id: rc.course_id,
            course_name: rc.course?.name || 'Unknown Course',
            score: 0
          })
        })
      } else {
        // Fallback for legacy or error
        groups[key].courses.push({
          course_id: 'unknown',
          course_name: 'No Course Info',
          score: 0
        })
      }
      groups[key].total_score += round.total_score
    })

    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date))
  }, [roundData])

  const recentRounds = groupedRounds.slice(0, 5)

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>
          개요
        </h1>
      </div>

      {/* Stats Row (Logged In / Logged Out) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        {user ? (
          <>
            <StatCard title="라운드" value={totalRounds} />
            <StatCard title="평균 타수" value={avgScore} accent />
            <StatCard title="베스트" value={bestScore} />
          </>
        ) : (
          <>
            <StatCard title="전체 골퍼" value={communityStats.totalUsers} />
            <StatCard title="전체 라운드" value={communityStats.totalRounds} />
            <StatCard title="전체 평균" value={communityStats.avgScore} accent />
          </>
        )}
      </div>

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
              padding: '16px 20px', background: 'white',
              borderBottom: '1px solid var(--color-border)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              className="hover:bg-gray-50"
              onClick={() => router.push(`/rounds/${round.id}`)}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {/* Line 1: Club Name (Primary) */}
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {round.club_name}
                </div>

                {/* Line 2: Metadata (Date | Courses) */}
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{round.date.replace(/-/g, '.')}</span>
                  <span style={{ width: '1px', height: '10px', background: 'var(--color-border)' }}></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    <span>{round.courses.map((c: any) => c.course_name).join(' / ')}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Total Score Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-light)',
                  fontSize: '1.1rem', fontWeight: 800,
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
            <p>아직 기록된 라운드가 없어요.</p>
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
