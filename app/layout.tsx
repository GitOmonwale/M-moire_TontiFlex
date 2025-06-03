import type { Metadata } from 'next'
import { archivo, chillax } from '@/lib/fonts'
import './globals.css'
import { LayoutWrapper } from '@/components/LayoutWrapper'

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
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}