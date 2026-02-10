import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/variables.css'
import '@/styles/global.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import ErrorSuppressor from '@/components/ErrorSuppressor'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Roundlog',
  description: 'Pro Golf Round Logger',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.error = function(...args) {
                  const msg = args.join(' ');
                  if (msg.includes('AbortError') || msg.includes('abort') || msg.includes('auth-js')) return;
                  originalError.apply(console, args);
                };
                
                console.warn = function(...args) {
                  const msg = args.join(' ');
                  if (msg.includes('AbortError') || msg.includes('abort')) return;
                  originalWarn.apply(console, args);
                };
                
                window.addEventListener('error', function(e) {
                  const stack = e.error?.stack || '';
                  if (e.error?.name === 'AbortError' || e.message?.includes('abort') || stack.includes('auth-js') || stack.includes('locks.ts')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                
                window.addEventListener('unhandledrejection', function(e) {
                  const stack = e.reason?.stack || '';
                  if (e.reason?.name === 'AbortError' || e.reason?.message?.includes('abort') || stack.includes('auth-js') || stack.includes('locks.ts')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorSuppressor />
        <AuthProvider>
          <Header />
          <main className="container" style={{ flex: 1, paddingBottom: '80px', minHeight: '100vh', paddingTop: '24px' }}>
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}