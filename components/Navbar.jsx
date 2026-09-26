'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  User,
  Settings, 
  LogOut, 
  BookOpenCheck, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  Sparkles,
  Store
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';

export function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/transactions', label: t('transactions'), icon: ArrowLeftRight },
    { href: '/customers', label: t('customers'), icon: Users },
    { href: '/advisor', label: t('advisor'), icon: Sparkles, badge: 'AI' },
    { href: '/profile', label: t('profile'), icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-2.5 sm:px-6 py-2 sm:py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Mobile: Hamburger + Brand / Desktop: Title */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            {/* Hamburger Button for Mobile Drawer */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text hover:bg-border/30 transition-all active:scale-95 shrink-0 min-h-[38px] min-w-[38px]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Link */}
            <Link href="/" className="flex lg:hidden items-center gap-2 min-w-0 max-w-[170px] xs:max-w-[220px]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-dark to-primary text-white flex items-center justify-center shadow-xs shrink-0">
                <BookOpenCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-heading font-extrabold text-sm sm:text-base text-text leading-tight block truncate">
                  QistBook
                </span>
                <span className="header-tagline text-[10px] sm:text-[11px] text-muted font-medium block">
                  {user?.shopName || (lang === 'ur' ? 'Digital Khata' : 'Digital Ledger')}
                </span>
              </div>
            </Link>

            {/* Desktop Brand Details */}
            <Link href="/profile" className="hidden lg:block group">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-lg text-text group-hover:text-primary transition">
                  {user?.shopName || 'QistBook'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-soft text-primary-dark dark:text-primary">
                  {user?.shopType || 'Kiryana'}
                </span>
              </div>
              <p className="text-xs text-muted group-hover:text-text transition">
                {user?.name} ({t('profile')})
              </p>
            </Link>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Responsive Segmented Language Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-surface-2 border border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('ur')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all min-h-[32px] sm:min-h-[34px] flex items-center justify-center text-[11px] sm:text-xs ${
                  lang === 'ur'
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-muted hover:text-text'
                }`}
                aria-label="Roman Urdu"
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all min-h-[32px] sm:min-h-[34px] flex items-center justify-center text-[11px] sm:text-xs ${
                  lang === 'en'
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-muted hover:text-text'
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-muted hover:text-text hover:bg-border/30 transition-all active:scale-95 shrink-0 min-h-[36px]"
              title={theme === 'dark' ? (lang === 'ur' ? 'Light Mode On Karein' : 'Switch to Light Mode') : (lang === 'ur' ? 'Dark Mode On Karein' : 'Switch to Dark Mode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-warning" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>

            {/* Profile Shortcut */}
            <Link
              href="/profile"
              aria-label={t('profile')}
              className={`hidden sm:flex w-10 h-10 rounded-xl bg-surface-2 border border-border items-center justify-center text-muted hover:text-text hover:bg-border/30 transition-all active:scale-95 shrink-0 ${
                pathname === '/profile' ? 'text-primary border-primary/40 bg-primary-soft' : ''
              }`}
              title={t('profile')}
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Desktop / Tablet Logout */}
            <button
              type="button"
              onClick={logout}
              aria-label={t('logout')}
              className="hidden lg:flex w-10 h-10 rounded-xl bg-surface-2 border border-border items-center justify-center text-udhaar hover:bg-udhaar/10 transition-all active:scale-95 shrink-0"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-Out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-4/5 max-w-xs bg-surface border-r border-border h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-dark to-primary text-white flex items-center justify-center shadow-xs">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-base text-text block">QistBook</span>
                  <span className="text-[10px] uppercase font-bold text-primary">Digital Khata</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 rounded-xl bg-surface-2 border border-border text-muted hover:text-text flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shopkeeper Profile Card */}
            {user && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 mx-3 mt-3 rounded-2xl bg-surface-2 border border-border flex items-center gap-3 hover:bg-surface-2/80 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary-dark dark:text-primary flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-text truncate">{user.name}</p>
                  <p className="text-[11px] text-muted truncate">{user.shopName || user.shopType || 'Kiryana'}</p>
                </div>
              </Link>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/' ? pathname === '/' : (pathname === item.href || pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-primary-soft text-primary-dark dark:text-primary font-bold shadow-xs'
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

            {/* Footer with Theme, Lang & Logout */}
            <div className="p-4 border-t border-border space-y-3 bg-surface-2/40">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted">{t('theme')}</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold flex items-center gap-1.5 text-text"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-warning" />
                      <span>{t('lightMode')}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-primary" />
                      <span>{t('darkMode')}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-udhaar bg-udhaar-soft hover:bg-udhaar/20 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
