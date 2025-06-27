import type { Metadata } from 'next'
import { archivo, chillax } from '@/lib/fonts'
import '../../globals.css'
import SideBar from '@/components/navigation/SideBar'
import Header from '@/components/dashboard/Header'
import ToasterProvider from './ToasterProvider'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" className={`${archivo.variable} ${chillax.variable}`}>
            <body className="overflow-hidden">
                <div className='flex h-screen'>
                    {/* Sidebar fixe */}
                    <SideBar />
                    
                    {/* Contenu principal scrollable */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-y-auto">
                            <ToasterProvider />
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}