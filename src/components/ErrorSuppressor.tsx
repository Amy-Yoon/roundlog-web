'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
    useEffect(() => {
        // Suppress Next.js error overlay for AbortError
        const originalError = console.error
        const originalWarn = console.warn

        console.error = (...args: any[]) => {
            const errorString = args.join(' ')
            if (
                errorString.includes('AbortError') ||
                errorString.includes('signal is aborted') ||
                errorString.includes('abort') ||
                errorString.includes('auth-js')
            ) {
                // Silently ignore AbortError
                return
            }
            originalError.apply(console, args)
        }

        console.warn = (...args: any[]) => {
            const warnString = args.join(' ')
            if (
                warnString.includes('AbortError') ||
                warnString.includes('signal is aborted') ||
                warnString.includes('abort')
            ) {
                return
            }
            originalWarn.apply(console, args)
        }

        // Prevent Next.js runtime error overlay
        if (typeof window !== 'undefined') {
            const handleError = (event: ErrorEvent) => {
                const stack = event.error?.stack || ''
                if (
                    event.error?.name === 'AbortError' ||
                    event.message?.includes('abort') ||
                    event.message?.includes('AbortError') ||
                    stack.includes('auth-js') ||
                    stack.includes('locks.ts')
                ) {
                    event.preventDefault()
                    event.stopPropagation()
                    event.stopImmediatePropagation()
                    return false
                }
            }

            const handleRejection = (event: PromiseRejectionEvent) => {
                const stack = event.reason?.stack || ''
                if (
                    event.reason?.name === 'AbortError' ||
                    event.reason?.message?.includes('abort') ||
                    stack.includes('auth-js') ||
                    stack.includes('locks.ts')
                ) {
                    event.preventDefault()
                    event.stopPropagation()
                    event.stopImmediatePropagation()
                    return false
                }
            }

            // Use capture phase to intercept earlier
            window.addEventListener('error', handleError, true)
            window.addEventListener('unhandledrejection', handleRejection, true)

            // Also add to normal phase as backup
            window.addEventListener('error', handleError, false)
            window.addEventListener('unhandledrejection', handleRejection, false)

            return () => {
                console.error = originalError
                console.warn = originalWarn
                window.removeEventListener('error', handleError, true)
                window.removeEventListener('unhandledrejection', handleRejection, true)
                window.removeEventListener('error', handleError, false)
                window.removeEventListener('unhandledrejection', handleRejection, false)
            }
        }
    }, [])

    return null
}
