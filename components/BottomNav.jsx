'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Users, Sparkles, Plus } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export function BottomNav({ onOpenQuickTxn }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const leftTabs = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/transactions', label: t('transactionsNav'), icon: ArrowLeftRight },
  ];

  const rightTabs = [
    { href: '/customers', label: t('customersNav'), icon: Users },
    { href: '/advisor', label: t('advisorNav'), icon: Sparkles, hasDot: true },
  ];

  const renderTab = (tab) => {
    const Icon = tab.icon;
    const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname?.startsWith(tab.href));

    return (
      <Link
        key={tab.href}
        href={tab.href}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 sm:px-1 rounded-xl transition-all min-h-[44px] relative ${
          isActive ? 'text-primary font-bold' : 'text-muted hover:text-text'
        }`}
        aria-label={tab.label}
      >
        <div className="relative flex items-center justify-center">
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isActive ? 'text-primary scale-110' : 'text-muted'}`} />
          {tab.hasDot && !isActive && (
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-warning ring-2 ring-surface animate-pulse" />
          )}
        </div>
        <span className="text-[10px] sm:text-[11px] tracking-tight mt-0.5 truncate max-w-[56px] xs:max-w-[70px]">
          {tab.label}
        </span>
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
        )}
      </Link>
    );
  };

  return (
    <nav className="lg:hidden fixed bottom-2.5 sm:bottom-3 left-2 right-2 sm:left-3 sm:right-3 z-40 max-w-md mx-auto bg-surface/95 backdrop-blur-xl border border-border/90 shadow-fintech-lg rounded-2xl px-1 sm:px-2 py-1 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left 2 Tabs */}
        <div className="flex items-center flex-1 justify-around">
          {leftTabs.map(renderTab)}
        </div>

        {/* Center Raised Circular Action Button */}
        <div className="flex items-center justify-center px-1">
          <button
            type="button"
            onClick={onOpenQuickTxn}
            aria-label={t('recordTransaction')}
            className="-mt-5 sm:-mt-6 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-primary-dark to-primary text-white flex items-center justify-center shadow-glow-primary ring-4 ring-bg active:scale-90 transition-transform cursor-pointer"
            title={t('recordTransaction')}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right 2 Tabs */}
        <div className="flex items-center flex-1 justify-around">
          {rightTabs.map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
