import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/variables.css'
import '@/styles/global.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'

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
      <body className={inter.className}>
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