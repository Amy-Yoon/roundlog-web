import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Round, RoundInsert, RoundUpdate } from '@/types/database.types'
import { useAuth } from '@/contexts/AuthContext'

export const useRounds = () => {
    const [rounds, setRounds] = useState<Round[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    const supabase = useMemo(() => createClient(), [])

    const fetchRounds = useCallback(async () => {
        if (!user) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const { data, error } = await supabase
                .from('rounds')
                .select('*, round_courses(*, course:golf_courses(*))')
                .eq('user_id', user.id)
                .order('date', { ascending: false })

            if (error) {
                // Silently handle error
                setRounds([])
                setError(null)
                return
            }

            setRounds(data as Round[])
            setError(null)
        } catch (err: any) {
            // Silently handle error
            setRounds([])
            setError(null)
        } finally {
            setLoading(false)
        }
    }, [user?.id, supabase])

    useEffect(() => {
        fetchRounds()
    }, [fetchRounds])

    // Composite input type for creating a round with all details
    type CreateRoundData = {
        round: RoundInsert
        courses: {
            course_id: string
            sequence: number
            hole_start: number
            hole_end: number
            holes_count: number
            holes?: {
                hole_no: number
                par: number
                score: number | null
                hole_comment?: string
            }[]
        }[]
    }

    const createRound = async (data: CreateRoundData) => {
        try {
            // 1. Insert Round
            const { data: roundData, error: roundError } = await (supabase.from('rounds') as any)
                .insert(data.round)
                .select()
                .single()

            if (roundError) throw roundError
            const roundId = roundData.id

            // 2. Insert Round Courses & Holes
            for (const courseData of data.courses) {
                const { holes, ...courseFields } = courseData
                const { data: rcData, error: rcError } = await (supabase.from('round_courses') as any)
                    .insert({
                        ...courseFields,
                        round_id: roundId
                    })
                    .select()
                    .single()

                if (rcError) throw rcError
                const roundCourseId = rcData.id

                // 3. Insert Holes if available
                if (holes && holes.length > 0) {
                    const holesInsert = holes.map(h => ({
                        ...h,
                        round_course_id: roundCourseId
                    }))

                    const { error: holesError } = await (supabase.from('round_holes') as any)
                        .insert(holesInsert)

                    if (holesError) throw holesError
                }
            }

            // Refresh local state (simplest way is to fetch again or reconstruct, fetching is safer for joins)
            fetchRounds()
            return roundData
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }

    const updateRound = async (id: string, updates: RoundUpdate) => {
        try {
            const { data, error } = await (supabase.from('rounds') as any)
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            setRounds((prev) => prev.map((r) => (r.id === id ? data : r)))
            return data
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }

    const deleteRound = async (id: string) => {
        try {
            const { error } = await supabase
                .from('rounds')
                .delete()
                .eq('id', id)

            if (error) throw error
            setRounds((prev) => prev.filter((r) => r.id !== id))
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }

    return {
        rounds,
        loading,
        error,
        fetchRounds,
        createRound,
        updateRound,
        deleteRound
    }
}
