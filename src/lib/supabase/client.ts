import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
    if (client) return client

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // During build time (prerendering on server), environment variables might be missing.
    // Use placeholders to prevent the build from crashing, but avoid baking them into the client.
    if (!url || !key) {
        if (typeof window === 'undefined') {
            return createBrowserClient<Database>(
                'https://placeholder.supabase.co',
                'placeholder-key'
            )
        }
        throw new Error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing! Please check your .env files.')
    }

    client = createBrowserClient<Database>(url, key)
    return client
}
