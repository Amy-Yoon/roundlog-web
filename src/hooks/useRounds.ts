import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Round, RoundInsert, RoundUpdate } from '@/types/database.types'
import { useAuth } from '@/contexts/AuthContext'

export const useRounds = () => {
    const [rounds, setRounds] = useState<Round[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    const supabase = createClient()

    const fetchRounds = useCallback(async () => {
        if (!user) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('rounds')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })

            if (error) throw error
            if (data) setRounds(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        fetchRounds()
    }, [fetchRounds])

    const createRound = async (round: RoundInsert) => {
        try {
            const { data, error } = await supabase
                .from('rounds')
                .insert(round)
                .select()
                .single()

            if (error) throw error
            setRounds((prev) => [data, ...prev])
            return data
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }

    const updateRound = async (id: string, updates: RoundUpdate) => {
        try {
            const { data, error } = await supabase
                .from('rounds')
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
