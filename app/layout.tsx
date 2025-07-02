// app/layout.tsx ou app/root-layout.tsx
import type { Metadata } from 'next'
import { archivo, chillax } from '@/lib/fonts'
import './globals.css'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import { AuthProvider } from '@/contexts/AuthContext'


export const metadata: Metadata = {
  title: 'Mon App',
  description: 'Description de mon app',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${archivo.variable} ${chillax.variable}`}>
      <body>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}