'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  Sparkles, 
  User, 
  Settings, 
  LogOut,
  Store,
  BookOpenCheck
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthProvider';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/transactions', label: t('transactions'), icon: ArrowLeftRight },
    { href: '/customers', label: t('customers'), icon: Users },
    { href: '/advisor', label: t('advisor'), icon: Sparkles, badge: 'AI' },
    { href: '/profile', label: t('profile'), icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border min-h-screen fixed left-0 top-0 bottom-0 z-30 transition-colors">
      {/* Brand Header */}
      <Link href="/" className="p-5 border-b border-border flex items-center gap-3 hover:bg-surface-2/40 transition">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-dark to-primary text-white flex items-center justify-center shadow-fintech shrink-0">
          <BookOpenCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-xl text-text tracking-tight">QistBook</span>
            <span className="text-[10px] uppercase font-bold bg-primary-soft text-primary-dark dark:text-primary px-1.5 py-0.5 rounded-md">PK</span>
          </div>
          <p className="text-[11px] text-muted font-medium truncate max-w-[145px]">
            {user?.shopName || (t('appName') + ' Khata')}
          </p>
        </div>
      </Link>

      {/* Shopkeeper Profile Card */}
      {user && (
        <Link 
          href="/profile" 
          title={t('profile')}
          className="px-3.5 py-3 mx-3.5 mt-4 rounded-2xl bg-surface-2 border border-border flex items-center gap-3 hover:bg-surface-2/80 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary-dark dark:text-primary flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text truncate">{user.name}</p>
            <p className="text-[11px] text-muted truncate">{user.shopType || 'Kiryana'}</p>
          </div>
        </Link>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : (pathname === item.href || pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary-soft text-primary-dark dark:text-primary shadow-xs font-bold'
                  : 'text-muted hover:bg-surface-2 hover:text-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-warning/20 text-warning">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3.5 border-t border-border">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-udhaar hover:bg-udhaar/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
