'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpenCheck, Lock, Mail, ArrowRight, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function LoginPage() {
  const { login, signup } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('demo@qistbook.com', 'demo1234');
    } catch {
      try {
        await signup({
          name: 'Haji Abdul Sattar',
          email: 'demo@qistbook.com',
          password: 'demo1234',
          shopName: t('demoStoreName'),
          shopType: 'Kiryana',
        });
      } catch (signupErr) {
        setError(signupErr.message || 'Failed to initialize demo account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-background w-full overflow-x-hidden">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-fintech-lg border border-border p-4.5 sm:p-8 space-y-5 sm:space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block hover:opacity-90 transition">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-primary-dark to-primary text-white flex items-center justify-center mx-auto shadow-glow-primary">
              <BookOpenCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </Link>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text tracking-tight">
            {t('appName')}
          </h1>
          <p className="text-xs text-muted font-medium px-2">
            {t('appTagline')}
          </p>
        </div>

        {/* Title */}
        <div className="border-b border-border pb-3">
          <h2 className="font-heading font-bold text-base sm:text-lg text-text">
            {t('loginTitle')}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {t('loginSubtitle')}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-udhaar-soft border border-udhaar/30 text-xs font-semibold text-udhaar flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-udhaar shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dukandar@qistbook.com"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-sm shadow-glow-primary active:scale-[0.98] transition disabled:opacity-60 cursor-pointer min-h-[44px]"
          >
            <span>{loading ? t('loading') : t('login')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full h-12 px-3 sm:px-4 rounded-2xl border border-primary/30 bg-primary-soft hover:bg-primary/20 text-primary font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer min-h-[44px]"
          >
            <Store className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{t('demoLoginBtn')}</span>
          </button>
        </div>

        {/* Switch to Signup / Register */}
        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-muted">
            {t('dontHaveAccount')}{' '}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              {t('signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
