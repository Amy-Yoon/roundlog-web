import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Club {
    id: string
    name: string
    location: string
    address?: string
    club_type?: string
    hole_count?: number
}

export interface Course {
    id: string
    golf_club_id: string
    name: string
    holes: number
}

export const useClubs = () => {
    const [clubs, setClubs] = useState<Club[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const fetchClubs = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('golf_clubs')
                .select('id, name, location, address, club_type, hole_count')
                .order('name', { ascending: true })

            if (error) throw error
            if (data) setClubs(data)
        } catch (err: any) {
            console.error('Error fetching clubs:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    const fetchCoursesByClub = async (clubId: string) => {
        const { data, error } = await supabase
            .from('golf_courses')
            .select('id, golf_club_id, name, holes')
            .eq('golf_club_id', clubId)

        if (error) throw error
        return data as Course[]
    }

    const fetchHolesByCourse = async (courseId: string) => {
        const { data, error } = await supabase
            .from('golf_course_holes')
            .select('*')
            .eq('course_id', courseId)
            .order('hole', { ascending: true })

        if (error) throw error
        return data
    }

    const fetchClubById = async (clubId: string) => {
        const { data, error } = await supabase
            .from('golf_clubs')
            .select('*')
            .eq('id', clubId)
            .single()

        if (error) throw error
        return data as Club & { address?: string; location: string }
    }

    useEffect(() => {
        fetchClubs()
    }, [fetchClubs])

    return {
        clubs,
        loading,
        error,
        fetchClubs,
        fetchCoursesByClub,
        fetchHolesByCourse,
        fetchClubById
    }
}
