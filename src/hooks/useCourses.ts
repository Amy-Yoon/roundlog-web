import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GolfCourse as Course } from '@/types/database.types'

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = useMemo(() => createClient(), [])

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('golf_courses')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            setCourses(data || [])
            setError(null)
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('abort')) return
            console.error('Error fetching courses:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return {
        courses,
        loading,
        error,
        fetchCourses
    }
}
