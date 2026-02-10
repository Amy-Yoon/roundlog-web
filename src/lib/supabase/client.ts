import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
    if (client) return client

    // Simplified literal access for Next.js static analysis.
    // If these are missing, the Supabase client will throw on creation.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // If variables are missing, let the error be clear.
    if (!url || !key) {
        if (typeof window !== 'undefined') {
            console.error('[CRITICAL] Supabase environment variables are missing! Check Vercel settings.')
        }
    }

    try {
        client = createBrowserClient<Database>(url, key)
    } catch (err) {
        console.error('Supabase initialization failed:', err)
        throw err
    }
    return client
}
