import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface Club {
    id: string; name: string; location: string; address?: string; club_type?: string; hole_count?: number
}

export interface Course {
    id: string; golf_club_id: string; name: string; holes: number
}

export type SortOption = 'recommended' | 'name' | 'location' | 'holes' | 'rating'

export const useClubs = (initialLimit = 10) => {
    const { user } = useAuth()
    const [clubs, setClubs] = useState<Club[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)
    const [sortBy, setSortBy] = useState<SortOption>('recommended')
    const [searchTerm, setSearchTerm] = useState('')
    const [onlyPlayed, setOnlyPlayed] = useState(false)

    // Using the singleton client
    const supabase = useMemo(() => createClient(), [])
    const requestCounter = useRef(0)

    const fetchClubs = useCallback(async (targetPage: number, isMore = false) => {
        const requestId = ++requestCounter.current

        try {
            if (isMore) setLoadingMore(true)
            else setLoading(true)
            setError(null)

            const from = targetPage * initialLimit
            const to = from + initialLimit - 1

            console.log('[useClubs] Fetching page ' + targetPage + ' (Request #' + requestId + ')')

            // Use the Supabase client for more robust data fetching and automatic URL encoding
            let query = supabase
                .from('golf_clubs')
                .select('id, name, location, address, club_type, hole_count', { count: 'exact' })

            // Filter by "only played" if requested
            if (onlyPlayed && user) {
                const { data: playedRounds } = await supabase
                    .from('rounds')
                    .select('club_id')
                    .eq('user_id', user.id)

                const playedIds = Array.from(new Set((playedRounds as { club_id: string }[])?.map(r => r.club_id).filter(Boolean) || []))

                if (playedIds.length > 0) {
                    query = query.in('id', playedIds)
                } else {
                    if (requestId === requestCounter.current) {
                        setClubs([])
                        setHasMore(false)
                        setLoading(false)
                        setLoadingMore(false)
                    }
                    return
                }
            }

            // Search filter
            if (searchTerm) {
                query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
            }

            // Sorting
            if (sortBy === 'location') query = query.order('location', { ascending: true })
            else if (sortBy === 'holes') query = query.order('hole_count', { ascending: false })
            else if (sortBy === 'recommended') query = query.order('hole_count', { ascending: false }).order('name', { ascending: true })
            else query = query.order('name', { ascending: true })

            // Pagination
            query = query.range(from, to)

            const { data, count, error: fetchError } = await query

            if (fetchError) throw fetchError

            if (requestId === requestCounter.current) {
                const totalCount = count || 0
                if (isMore) {
                    setClubs(prev => {
                        const existingIds = new Set(prev.map(c => c.id))
                        const filtered = (data as Club[] || []).filter(c => !existingIds.has(c.id))
                        return [...prev, ...filtered]
                    })
                    setPage(targetPage)
                } else {
                    setClubs(data || [])
                    setPage(0)
                }
                setHasMore(totalCount ? from + (data?.length || 0) < totalCount : (data?.length || 0) === initialLimit)
            }
        } catch (err: any) {
            if (requestId === requestCounter.current) {
                // Ignore intentional aborts/cancellations
                if (err.name === 'AbortError' || err.message?.includes('abort') || err.code === 'PGRST116') {
                    return;
                }
                console.error('[useClubs] Request #' + requestId + ' ERROR:', err)
                setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.')
            }
        } finally {
            if (requestId === requestCounter.current) {
                setLoading(false)
                setLoadingMore(false)
            }
        }
    }, [supabase, initialLimit, sortBy, searchTerm, onlyPlayed, user?.id])

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchClubs(0, false)
        }, searchTerm ? 300 : 0)
        return () => clearTimeout(timeout)
    }, [fetchClubs, searchTerm])

    const loadMore = () => {
        if (!loadingMore && hasMore && !loading) fetchClubs(page + 1, true)
    }

    const changeSort = (newSort: SortOption) => setSortBy(newSort)
    const search = (term: string) => setSearchTerm(term)
    const toggleOnlyPlayed = () => setOnlyPlayed(prev => !prev)

    const fetchCoursesByClub = useCallback(async (clubId: string) => {
        try {
            const { data, error: fetchError } = await supabase
                .from('golf_courses')
                .select('id, golf_club_id, name, holes')
                .eq('golf_club_id', clubId)

            if (fetchError) throw fetchError
            return data as Course[]
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('abort')) return []
            console.error('[useClubs] fetchCoursesByClub ERROR:', err)
            throw err
        }
    }, [supabase])

    const fetchHolesByCourse = useCallback(async (courseId: string) => {
        try {
            const { data, error: fetchError } = await supabase
                .from('golf_course_holes')
                .select('*')
                .eq('course_id', courseId)
                .order('hole', { ascending: true })

            if (fetchError) throw fetchError
            return data
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('abort')) return []
            console.error('[useClubs] fetchHolesByCourse ERROR:', err)
            throw err
        }
    }, [supabase])

    const fetchClubById = useCallback(async (clubId: string) => {
        try {
            const { data, error: fetchError } = await supabase
                .from('golf_clubs')
                .select('*')
                .eq('id', clubId)
                .single()

            if (fetchError) {
                console.error(`[useClubs] Fetch club error:`, fetchError)
                return null
            }

            return data as Club & { address?: string; location: string }
        } catch (err: any) {
            console.error('[useClubs] Unexpected error in fetchClubById:', err)
            return null
        }
    }, [supabase])

    return {
        clubs, loading, loadingMore, error, hasMore, sortBy, searchTerm, onlyPlayed,
        loadMore, changeSort, toggleOnlyPlayed, search, fetchClubs,
        fetchCoursesByClub, fetchHolesByCourse, fetchClubById
    }
}
