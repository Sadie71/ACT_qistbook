'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { QuickTransactionModal } from './QuickTransactionModal';

export function AppShell({ children }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [quickTxnOpen, setQuickTxnOpen] = useState(false);
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/register';
  const isPublicHome = pathname === '/' && !user;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center text-white shadow-glow-primary animate-pulse mb-4">
          <span className="font-heading font-extrabold text-2xl">Q</span>
        </div>
        <p className="text-sm font-bold text-text">QistBook Digital Khata</p>
        <p className="text-xs text-muted mt-1">Baraye meherbani intezar karein...</p>
      </div>
    );
  }

  if (isAuthPage || isPublicHome) {
    return <main className="min-h-screen bg-bg text-text">{children}</main>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-muted">Login par muntaqil ho rahe hain...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-bg text-text transition-colors overflow-x-hidden w-full max-w-full">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-24 lg:pb-8 w-full">
        <Navbar />
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Nav with Center Action */}
      <BottomNav onOpenQuickTxn={() => setQuickTxnOpen(true)} />

      {/* Global Quick Transaction Modal triggered from BottomNav center button */}
      <QuickTransactionModal
        isOpen={quickTxnOpen}
        onClose={() => setQuickTxnOpen(false)}
      />
    </div>
  );
}
