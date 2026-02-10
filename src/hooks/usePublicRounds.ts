import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Round } from '@/types/database.types'

export const usePublicRounds = () => {
    const [rounds, setRounds] = useState<Round[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = useMemo(() => createClient(), [])

    const fetchPublicRounds = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error } = await supabase
                .from('rounds')
                .select('*, round_courses(*, course:golf_courses(*))')
                .eq('is_public', true)
                .order('date', { ascending: false })
                .limit(20)

            if (error) {
                // Silently handle error - just set empty array
                setRounds([])
                setError(null) // Don't show error to user
                return
            }

            setRounds(data as Round[])
            setError(null)
        } catch (err: any) {
            // Silently handle error - just set empty array
            setRounds([])
            setError(null) // Don't show error to user
        } finally {
            setLoading(false)
        }
    }, [supabase])

    const fetchPublicRoundsByClub = useCallback(async (clubId: string) => {
        try {
            const { data, error } = await supabase
                .from('rounds')
                .select('*')
                .eq('is_public', true)
                .eq('club_id', clubId)
                .order('date', { ascending: false })
                .limit(50)

            if (error) throw error
            return data as Round[]
        } catch (err: any) {
            console.error('Error fetching club public rounds:', err)
            return []
        }
    }, [supabase])

    useEffect(() => {
        fetchPublicRounds()
    }, [fetchPublicRounds])

    return {
        rounds,
        loading,
        error,
        fetchPublicRounds,
        fetchPublicRoundsByClub
    }
}
