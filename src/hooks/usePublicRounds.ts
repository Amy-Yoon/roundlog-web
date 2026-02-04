import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Round } from '@/types/database.types'

export const usePublicRounds = () => {
    const [rounds, setRounds] = useState<Round[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const fetchPublicRounds = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('rounds')
                .select('*')
                .eq('is_public', true)
                .order('date', { ascending: false })
                .limit(20) // Limit to recent 20 for dashboard

            if (error) throw error
            if (data) setRounds(data)
        } catch (err: any) {
            console.error('Error fetching public rounds:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchPublicRounds()
    }, [fetchPublicRounds])

    return {
        rounds,
        loading,
        error,
        fetchPublicRounds
    }
}
