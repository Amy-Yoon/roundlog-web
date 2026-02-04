'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { UserProfile as DbUser, UserProfileUpdate as DbUserUpdate } from '@/types/database.types'

interface AuthContextType {
    user: User | null
    dbUser: DbUser | null
    loading: boolean
    signInWithGoogle: () => Promise<void>
    signInWithEmail: (email: string, password: string) => Promise<void>
    signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
    signOut: () => Promise<void>
    updateProfile: (updates: DbUserUpdate) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    dbUser: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    signOut: async () => { },
    updateProfile: async () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [dbUser, setDbUser] = useState<DbUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchUser = async (sessionUser: User | null) => {
            if (!sessionUser) {
                setUser(null)
                setDbUser(null)
                setLoading(false)
                return
            }

            setUser(sessionUser)
            // Fetch extended user profile from 'users' table
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', sessionUser.id)
                .single()

            if (data) {
                setDbUser(data)
            } else if (error && error.code === 'PGRST116') {
                // User doesn't exist in 'users' table yet
            }
            setLoading(false)
        }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
            if (session?.user) {
                await fetchUser(session.user)
            } else {
                await fetchUser(null)
            }
            router.refresh()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router, supabase])

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        router.push('/')
        router.refresh()
    }

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        })
        if (error) throw error
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    const updateProfile = async (updates: DbUserUpdate) => {
        if (!user) return

        const { error } = await (supabase.from('users') as any)
            .update(updates)
            .eq('id', user.id)

        if (error) throw error

        // Optimistic update
        setDbUser(prev => prev ? { ...prev, ...updates } as DbUser : null)
        router.refresh()
    }

    return (
        <AuthContext.Provider value={{ user, dbUser, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
