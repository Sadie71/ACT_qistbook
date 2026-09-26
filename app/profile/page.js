'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  User, 
  Mail, 
  Lock, 
  Save, 
  LogOut, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { authFetch } from '@/lib/apiClient';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, refreshUser, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('Kiryana');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setShopName(user.shopName || '');
      setShopType(user.shopType || 'Kiryana');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError(t('passwordLengthError'));
      return;
    }

    setSaving(true);
    try {
      const res = await authFetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          shopName,
          shopType,
          ...(newPassword && { newPassword }),
        }),
      });

      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      showToast(t('profileSavedSuccess'), 'success');
      setNewPassword('');
      setConfirmPassword('');
      if (refreshUser) refreshUser();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="pb-1">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text tracking-tight">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-muted font-medium mt-0.5">
          {t('settingsSubtitle')}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-udhaar-soft border border-udhaar/30 text-xs sm:text-sm font-semibold text-udhaar flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-udhaar shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl sm:rounded-3xl border border-border shadow-fintech-lg p-4 sm:p-7 space-y-5">
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            {t('ownerNameLabel')}
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            {t('shopTypeLabel')}
          </label>
          <select
            value={shopType}
            onChange={(e) => setShopType(e.target.value)}
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
              disabled
              value={user?.email || ''}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2/60 text-muted text-sm outline-none cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-sm text-text">
              {t('changePassword')} ({t('optional')})
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('newPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('newPasswordPlaceholder')}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('confirmPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirmPasswordPlaceholder')}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full h-13 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-sm shadow-glow-primary active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t('loading') : t('saveChanges')}</span>
          </button>
        </div>
      </form>

      {/* Logout Card */}
      <div className="bg-surface rounded-2xl sm:rounded-3xl border border-udhaar/20 shadow-fintech p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-heading font-bold text-sm sm:text-base text-text">
            {t('logoutCardTitle')}
          </h4>
          <p className="text-xs text-muted mt-0.5">
            {t('logoutCardSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-udhaar-soft hover:bg-udhaar/20 text-udhaar font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer min-h-[44px] self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4 text-udhaar" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}
