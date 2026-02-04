import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GolfCourse as Course } from '@/types/database.types'

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await (supabase.from('golf_courses') as any)
                .select('*')
                .order('name')

            if (error) throw error
            if (data) setCourses(data)
        } catch (err: any) {
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
