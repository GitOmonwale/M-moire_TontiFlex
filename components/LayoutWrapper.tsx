'use client';
import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/navigation/NavBar';
import { Footer } from '@/components/footer/Footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/dashboard';

  return (
    <>
      {!isAuthPage && <NavBar />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}