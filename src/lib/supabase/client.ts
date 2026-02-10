import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
    if (client) return client

    // Simplified literal access for Next.js static analysis.
    // If these are missing, the Supabase client will throw on creation.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (typeof window !== 'undefined') {
        console.log('[DEBUG] Supabase Init - URL present:', !!url, 'Key present:', !!key)
    }

    try {
        client = createBrowserClient<Database>(url, key)
    } catch (err) {
        console.error('Supabase initialization failed:', err)
        // Fallback for extreme build safety
        client = createBrowserClient<Database>(
            'https://placeholder.supabase.co',
            'placeholder-key'
        )
    }
    return client
}
