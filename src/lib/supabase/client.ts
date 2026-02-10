import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
    if (client) return client

    // Use direct literal access within the function body to ensure 
    // Next.js static analysis bakes them into the client bundle.
    try {
        client = createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    } catch (err) {
        console.error('Supabase initialization error:', err)
        // Fallback for build time safety
        client = createBrowserClient<Database>(
            'https://placeholder.supabase.co',
            'placeholder-key'
        )
    }
    return client
}
