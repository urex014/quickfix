'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Global Security: Kick out unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-pink-50 flex items-center justify-center"><Loader /></div>;
  }

  const role = (session?.user as any)?.role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 font-sans text-slate-900">
      {/* Shared Navigation Bar */}
      <nav className="bg-white border-b border-pink-100/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-black tracking-tighter text-purple-950">
            Quick<span className="text-pink-500">Fix</span>. 
            {role === 'staff' && (
              <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-md ml-2 align-middle">Staff</span>
            )}
          </Link>
          
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-slate-500 hidden md:inline-block">
              Welcome, {session?.user?.name}
            </span>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors"
            >
              Sign Out
            </button>
            
            {/* Only show the report button to students */}
            {role === 'student' && (
              <Link 
                href="/dashboard/report" 
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-800 to-pink-500 rounded-md hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all"
              >
                + Report Issue
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* This is where your page.tsx will render */}
      {children}
    </div>
  );
}