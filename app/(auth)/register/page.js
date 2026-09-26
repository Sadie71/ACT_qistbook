'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpenCheck, Lock, Mail, Store, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function RegisterPage() {
  const { signup } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    shopType: 'Kiryana',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-background w-full overflow-x-hidden">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-fintech-lg border border-border p-4.5 sm:p-8 space-y-4 sm:space-y-5">
        {/* Header */}
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
            {t('signupTitle')}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-udhaar-soft border border-udhaar/30 text-xs font-semibold text-udhaar flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-udhaar shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('ownerNameLabel')}
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tariq Mehmood"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('shopNameLabel')}
            </label>
            <div className="relative">
              <Store className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="Al-Madina General Store"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('shopTypeLabel')}
            </label>
            <select
              value={formData.shopType}
              onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
              className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
            >
              <option value="Kiryana">Kiryana Store</option>
              <option value="General Store">General Merchant</option>
              <option value="Hardware">Hardware & Sanitary</option>
              <option value="Tailor">Tailor / Fabrics Shop</option>
              <option value="Milk Shop">Milk & Dairy Shop</option>
              <option value="Other">Other Business</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t('newPasswordPlaceholder')}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-sm shadow-glow-primary active:scale-[0.98] transition disabled:opacity-60 cursor-pointer min-h-[44px]"
            >
              <span>{loading ? t('loading') : t('signup')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-muted">
            {t('alreadyHaveAccount')}{' '}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
