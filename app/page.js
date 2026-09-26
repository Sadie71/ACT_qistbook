'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpenCheck, 
  ArrowRight, 
  Store, 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  Sparkles, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // If session is still loading, show smooth loader
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-dark to-primary text-white flex items-center justify-center shadow-glow-primary animate-pulse mb-3">
          <BookOpenCheck className="w-6 h-6" />
        </div>
        <p className="text-xs text-muted font-medium">{t('loading')}</p>
      </div>
    );
  }

  // LOGGED-IN VIEW: Shopkeeper Home Overview Hub
  if (user) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-blue-700 text-white p-6 sm:p-8 shadow-fintech-lg">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider">
                {user.shopType || 'Kiryana'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {t('homeHeroBadge')}
              </span>
            </div>

            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl tracking-tight leading-tight">
                {t('homeWelcome', { name: user.name })}
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-1 max-w-xl font-medium">
                {t('homeSubtitle', { shopName: user.shopName || 'QistBook' })}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-primary-dark font-heading font-extrabold text-xs sm:text-sm shadow-fintech active:scale-95 transition hover:bg-white/95 min-h-[44px]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('homeOpenDashboard')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/customers"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-xs sm:text-sm backdrop-blur-sm active:scale-95 transition min-h-[44px]"
              >
                <Users className="w-4 h-4" />
                <span>{t('homeViewCustomers')}</span>
              </Link>
            </div>
          </div>

          {/* Decorative Background Icon */}
          <div className="absolute -bottom-6 -right-6 text-white/10 pointer-events-none select-none">
            <BookOpenCheck className="w-64 h-64" />
          </div>
        </div>

        {/* Quick Access Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Dashboard */}
          <Link
            href="/dashboard"
            className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-fintech hover:shadow-fintech-lg transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center group-hover:scale-105 transition">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text group-hover:text-primary transition">
                  {t('dashboard')}
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {t('homeCardDashboardDesc')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>{t('homeCardDashboardLink')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 2: Transactions */}
          <Link
            href="/transactions"
            className="p-5 rounded-2xl bg-surface border border-border hover:border-udhaar/50 shadow-fintech hover:shadow-fintech-lg transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-udhaar-soft text-udhaar flex items-center justify-center group-hover:scale-105 transition">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text group-hover:text-udhaar transition">
                  {t('transactions')}
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {t('homeCardTransactionsDesc')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-udhaar">
              <span>{t('homeCardTransactionsLink')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 3: Customers */}
          <Link
            href="/customers"
            className="p-5 rounded-2xl bg-surface border border-border hover:border-wasooli/50 shadow-fintech hover:shadow-fintech-lg transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-wasooli-soft text-wasooli flex items-center justify-center group-hover:scale-105 transition">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text group-hover:text-wasooli transition">
                  {t('customers')}
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {t('homeCardCustomersDesc')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-wasooli">
              <span>{t('homeCardCustomersLink')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 4: AI Advisor */}
          <Link
            href="/advisor"
            className="p-5 rounded-2xl bg-surface border border-border hover:border-warning/50 shadow-fintech hover:shadow-fintech-lg transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-warning/15 text-warning flex items-center justify-center group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-base text-text group-hover:text-warning transition">
                    {t('advisor')}
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-warning/20 text-warning">AI</span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {t('homeCardAdvisorDesc')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-warning">
              <span>{t('homeCardAdvisorLink')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 5: Profile */}
          <Link
            href="/profile"
            className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-fintech hover:shadow-fintech-lg transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-surface-2 text-text flex items-center justify-center group-hover:scale-105 transition">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text group-hover:text-primary transition">
                  {t('profile')}
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {t('homeCardProfileDesc')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>{t('homeCardProfileLink')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 6: Direct Fast Action */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-surface to-surface-2 border border-border shadow-fintech flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-base text-text">{t('homeCardShopInfo')}</h3>
              </div>
              <p className="text-xs text-muted">
                {t('homeShopLabel')}: <span className="font-semibold text-text">{user.shopName}</span>
              </p>
              <p className="text-xs text-muted">
                {t('homeEmailLabel')}: <span className="font-semibold text-text">{user.email}</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
              <Link
                href="/dashboard"
                className="w-full text-center py-2 px-3 rounded-xl bg-primary-soft text-primary font-bold text-xs hover:bg-primary/20 transition min-h-[38px] flex items-center justify-center"
              >
                {t('homeGoToDashboard')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PUBLIC VIEW: Clean, high-impact Landing Page for QistBook
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary-soft selection:text-primary">
      {/* Public Landing Header */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-dark to-primary text-white flex items-center justify-center shadow-fintech shrink-0">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base sm:text-xl text-text leading-tight block">
                {t('appName')}
              </span>
              <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">
                {lang === 'ur' ? 'Digital Khata' : 'Digital Ledger'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Lang switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-surface-2 border border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('ur')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'ur' ? 'bg-surface text-primary shadow-xs font-bold' : 'text-muted'
                }`}
                aria-label="Roman Urdu"
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'en' ? 'bg-surface text-primary shadow-xs font-bold' : 'text-muted'
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-muted hover:text-text transition shrink-0"
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>

            {/* Login Link */}
            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-text hover:bg-surface-2 transition min-h-[40px] flex items-center"
            >
              {t('login')}
            </Link>

            {/* Register CTA */}
            <Link
              href="/register"
              className="px-3.5 sm:px-4.5 py-2 rounded-xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-xs sm:text-sm shadow-glow-primary active:scale-95 transition min-h-[40px] flex items-center"
            >
              {t('register')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary-dark dark:text-primary text-xs font-bold border border-primary/20 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>{t('landingBadge')}</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-text tracking-tight max-w-3xl mx-auto leading-[1.15]">
          {t('landingHeadline')}
        </h1>

        <p className="text-sm sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-medium">
          {t('landingSubheadline')}
        </p>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-sm shadow-glow-primary hover:opacity-95 active:scale-95 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>{t('landingCtaRegister')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface border border-border hover:bg-surface-2 text-text font-heading font-bold text-sm shadow-fintech active:scale-95 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>{t('landingCtaLogin')}</span>
          </Link>
        </div>

        <p className="text-xs text-muted font-medium">
          {t('landingDemoNotice')}
        </p>
      </section>

      {/* Feature Grid Section */}
      <section className="px-4 sm:px-8 py-12 bg-surface-2/40 border-y border-border">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text">
              {t('landingFeatureTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
              {t('landingFeatureSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-fintech space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-text">{t('featLedgerTitle')}</h3>
              <p className="text-xs text-muted leading-relaxed">
                {t('featLedgerDesc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-fintech space-y-3">
              <div className="w-10 h-10 rounded-xl bg-wasooli-soft text-wasooli flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-text">{t('featWhatsappTitle')}</h3>
              <p className="text-xs text-muted leading-relaxed">
                {t('featWhatsappDesc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-fintech space-y-3">
              <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-text">{t('featAiTitle')}</h3>
              <p className="text-xs text-muted leading-relaxed">
                {t('featAiDesc')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-fintech space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-text">{t('featCloudTitle')}</h3>
              <p className="text-xs text-muted leading-relaxed">
                {t('featCloudDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-8 border-t border-border text-center space-y-3">
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-muted">
          <Link href="/login" className="hover:text-primary transition">{t('login')}</Link>
          <span>•</span>
          <Link href="/register" className="hover:text-primary transition">{t('register')}</Link>
          <span>•</span>
          <Link href="/dashboard" className="hover:text-primary transition">{t('dashboard')}</Link>
        </div>
        <p className="text-xs text-muted">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  );
}
