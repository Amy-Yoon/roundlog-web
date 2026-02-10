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
        const handleRejection = (event: PromiseRejectionEvent) => {
            if (event.reason?.name === 'AbortError' || event.reason?.message?.includes('abort')) {
                event.preventDefault();
            }
        };

        const handleError = (event: ErrorEvent) => {
            if (event.error?.name === 'AbortError' || event.message?.includes('abort')) {
                event.preventDefault();
            }
        };

        window.addEventListener('unhandledrejection', handleRejection);
        window.addEventListener('error', handleError);

        const fetchUser = async (sessionUser: User | null) => {
            try {
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
            } catch (err: any) {
                if (err.name === 'AbortError' || err.message?.includes('abort')) {
                    return;
                }
                // Silently handle error
            } finally {
                setLoading(false)
            }
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
            window.removeEventListener('unhandledrejection', handleRejection);
            window.removeEventListener('error', handleError);
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
        console.log('[DEBUG] signOut function called');
        try {
            console.log('[DEBUG] Calling supabase.auth.signOut()');
            const { error } = await supabase.auth.signOut()
            console.log('[DEBUG] signOut response:', { error });
            if (error) throw error
            console.log('[DEBUG] signOut successful');
        } catch (err) {
            console.error('[DEBUG] signOut error:', err);
        } finally {
            console.log('[DEBUG] In finally block, clearing state');
            // Force local state clear immediately for UI responsiveness
            setUser(null)
            setDbUser(null)

            console.log('[DEBUG] Redirecting to /');
            // Use window.location.href to force a full page reload and clear any client-side state/cache
            window.location.href = '/'
        }
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
