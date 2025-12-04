
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarContent } from '@/components/sidebar';
import { AppHeader } from '@/components/header';
import { useEffect } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn && (isAuthPage || isLandingPage)) {
        router.push('/dashboard');
    }
    if (!isLoggedIn && !isAuthPage && !isLandingPage) {
        router.push('/login');
    }
  }, [pathname, router, isAuthPage, isLandingPage]);


  if (isAuthPage || isLandingPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
        <Sidebar>
            <AppSidebarContent />
        </Sidebar>
        <SidebarInset>
            <AppHeader />
            <div className="p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
