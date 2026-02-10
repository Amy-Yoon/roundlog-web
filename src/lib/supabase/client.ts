import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
    if (client) return client

    // Simplified literal access for Next.js static analysis.
    // If these are missing, the Supabase client will throw on creation.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If variables are missing, don't crash the build.
    // Instead, log a clear warning and use placeholders to allow hydration/prerendering.
    if (!url || !key) {
        if (typeof window === 'undefined') {
            console.warn('[BUILD WARNING] Supabase environment variables are missing during build/prerendering. Using placeholders.')
        } else {
            console.error('[RUNTIME ERROR] Supabase environment variables are missing! Please check Vercel settings.')
        }

        return createBrowserClient<Database>(
            url || 'https://placeholder.supabase.co',
            key || 'placeholder-key'
        )
    }

    try {
        client = createBrowserClient<Database>(url, key)
    } catch (err) {
        console.error('Supabase initialization failed unexpectedly:', err)
        return createBrowserClient<Database>(
            'https://placeholder.supabase.co',
            'placeholder-key'
        )
    }
    return client
}
