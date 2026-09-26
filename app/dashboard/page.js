'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  AlertCircle, 
  MessageSquare, 
  Users, 
  Plus, 
  ChevronRight,
  Sparkles,
  RefreshCw,
  Wallet,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { formatMoney, formatDate, getAvatarColor, getInitials } from '@/lib/utils';
import { QuickTransactionModal } from '@/components/QuickTransactionModal';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { authFetch } from '@/lib/apiClient';

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Modals state
  const [txnModalOpen, setTxnModalOpen] = useState(false);
  const [txnType, setTxnType] = useState('udhaar');
  const [whatsappCustomer, setWhatsappCustomer] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const res = await authFetch('/api/dashboard');
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || t('loadErrorTitle'));
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, router, t]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const openTxn = (type) => {
    setTxnType(type);
    setTxnModalOpen(true);
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-surface-2 rounded-xl" />
        <div className="grid stats-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-32 bg-surface rounded-2xl border border-border p-4 sm:p-5" />
          ))}
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 action-grid">
          <div className="h-14 sm:h-16 bg-surface-2 rounded-2xl" />
          <div className="h-14 sm:h-16 bg-surface-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="card p-6 sm:p-8 bg-surface rounded-3xl border border-udhaar/30 text-center space-y-4 shadow-fintech max-w-lg mx-auto mt-6">
        <div className="w-12 h-12 rounded-2xl bg-udhaar/15 text-udhaar flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-text">
            {t('loadErrorTitle')}
          </h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchDashboardData}
          className="action-btn px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-glow-primary active:scale-95 transition min-h-[44px] cursor-pointer"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  const {
    totalOutstandingCredit = 0,
    todayWasooli = 0,
    collectionRate = 0,
    topDebtors = [],
    last7Days = [],
    recentTransactions = [],
    totalCustomers = 0,
  } = data || {};

  // Maximum value for chart scaling
  const maxDayAmount = Math.max(
    ...last7Days.flatMap((d) => [d.udhaar, d.wasooli]),
    1000
  );

  const todayFormatted = new Date().toLocaleDateString(lang === 'ur' ? 'en-PK' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const shopName = user?.shopName || 'QistBook';
  const userName = user?.name || user?.shopName || 'Shopkeeper';

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Top Greeting & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-primary-soft text-primary-dark dark:text-primary">
              {t('ledger')}
            </span>
            <span className="text-[11px] sm:text-xs text-muted flex items-center gap-1 font-medium truncate">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{todayFormatted}</span>
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-text tracking-tight mt-1 break-words">
            {t('welcomeUser', { name: userName })}
          </h1>

          <p className="text-xs text-muted font-medium mt-0.5 truncate">
            {t('shopSubtitle', { shopName })}
          </p>
        </div>

        {/* Refresh Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchDashboardData}
            title={t('refreshTooltip')}
            className="action-btn sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface border border-border text-xs font-semibold text-text active:scale-95 transition min-h-[44px] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${loading ? 'animate-spin' : ''}`} />
            <span>{t('refresh')}</span>
          </button>
        </div>
      </div>

      {/* 3 STAT CARDS: Responsive Mobile Stacking */}
      <div className="grid stats-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* 1. Total Outstanding Credit */}
        <div className="card bg-udhaar-soft/70 border border-udhaar/30 p-4 sm:p-5 rounded-2xl shadow-fintech relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-udhaar uppercase tracking-wider">
              {t('totalOutstanding')}
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-udhaar/20 text-udhaar flex items-center justify-center shadow-xs shrink-0">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-udhaar tabular-nums tracking-tight truncate">
              {formatMoney(totalOutstandingCredit, lang)}
            </div>
            <p className="text-xs text-udhaar/80 font-medium mt-1">
              {t('totalCreditStuck')}
            </p>
          </div>
        </div>

        {/* 2. Today's Cash Recovered */}
        <div className="card bg-wasooli-soft/70 border border-wasooli/30 p-4 sm:p-5 rounded-2xl shadow-fintech relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-wasooli uppercase tracking-wider">
              {t('todayWasooli')}
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-wasooli/20 text-wasooli flex items-center justify-center shadow-xs shrink-0">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-wasooli tabular-nums tracking-tight truncate">
              {formatMoney(todayWasooli, lang)}
            </div>
            <p className="text-xs text-wasooli/80 font-medium mt-1">
              {t('todayCashIn')}
            </p>
          </div>
        </div>

        {/* 3. Active Customers & Recovery Rate */}
        <div className="card bg-surface border border-border p-4 sm:p-5 rounded-2xl shadow-fintech relative overflow-hidden transition-transform hover:-translate-y-0.5 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              {t('activeCustomersRecovery')}
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary-soft text-primary-dark dark:text-primary flex items-center justify-center shadow-xs shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-text tabular-nums tracking-tight">
                {totalCustomers}
              </div>
              <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary-soft">
                {t('recoveredPercentage', { n: collectionRate })}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-wasooli rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, collectionRate)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2 PRIMARY ACTION BUTTONS: Mobile touch targets min-h-[44px] */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 action-grid">
        {/* + Udhaar Diya Button */}
        <button
          type="button"
          onClick={() => openTxn('udhaar')}
          className="action-btn h-13 sm:h-16 px-3 sm:px-4 rounded-2xl border-2 border-udhaar/40 bg-udhaar-soft/90 text-udhaar font-heading font-bold text-xs sm:text-sm md:text-base hover:bg-udhaar/20 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 sm:gap-3 cursor-pointer min-h-[44px]"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-udhaar text-white flex items-center justify-center shadow-xs shrink-0">
            <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <span className="truncate">{t('btnCreditGiven')}</span>
        </button>

        {/* + Wasooli Mili Button */}
        <button
          type="button"
          onClick={() => openTxn('wasooli')}
          className="action-btn h-13 sm:h-16 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-xs sm:text-sm md:text-base hover:opacity-95 active:scale-[0.98] transition-all shadow-glow-primary flex items-center justify-center gap-2 sm:gap-3 cursor-pointer min-h-[44px]"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-xs shrink-0">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <span className="truncate">{t('btnPaymentReceived')}</span>
        </button>
      </div>

      {/* Main Two Columns: Chart & Top Debtors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Last 7 Days Activity Chart */}
        <div className="lg:col-span-7 card bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-fintech space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-text">
                {t('last7Days')}
              </h2>
              <p className="text-xs text-muted">
                {t('last7DaysComparison')}
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-udhaar" />
                <span className="text-muted font-medium">{t('credit')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-wasooli" />
                <span className="text-muted font-medium">{t('recovery')}</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-2 sm:pt-4 overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 h-44 sm:h-48 items-end border-b border-border pb-3 min-w-[280px]">
              {last7Days.map((d, index) => {
                const udhaarHeight = Math.max(8, Math.round((d.udhaar / maxDayAmount) * 100));
                const wasooliHeight = Math.max(8, Math.round((d.wasooli / maxDayAmount) * 100));

                return (
                  <div key={index} className="flex flex-col items-center gap-1.5 sm:gap-2 h-full justify-end group">
                    <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center h-full">
                      {/* Udhaar Bar */}
                      <div
                        style={{ height: `${d.udhaar > 0 ? udhaarHeight : 4}%` }}
                        className={`w-2.5 sm:w-4 rounded-t-md transition-all duration-300 ${
                          d.udhaar > 0 ? 'bg-udhaar group-hover:opacity-90' : 'bg-surface-2'
                        }`}
                        title={`${t('credit')}: ${formatMoney(d.udhaar, lang)}`}
                      />
                      {/* Wasooli Bar */}
                      <div
                        style={{ height: `${d.wasooli > 0 ? wasooliHeight : 4}%` }}
                        className={`w-2.5 sm:w-4 rounded-t-md transition-all duration-300 ${
                          d.wasooli > 0 ? 'bg-wasooli group-hover:opacity-90' : 'bg-surface-2'
                        }`}
                        title={`${t('recovery')}: ${formatMoney(d.wasooli, lang)}`}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] sm:text-[11px] font-bold text-text block">{d.day}</span>
                      <span className="text-[9px] text-muted block">{d.date.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Advisor Feature Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-primary-soft to-surface-2 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-dark to-primary text-white flex items-center justify-center shadow-fintech shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text truncate">{t('aiCardTitle')}</p>
                <p className="text-[11px] text-muted truncate">{t('aiCardDesc')}</p>
              </div>
            </div>
            <Link
              href="/advisor"
              className="action-btn sm:w-auto px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-border text-primary font-bold text-xs shadow-xs transition text-center shrink-0 min-h-[44px] flex items-center justify-center"
            >
              {t('aiCardBtn')}
            </Link>
          </div>
        </div>

        {/* Right Column: Top 5 Debtors */}
        <div className="lg:col-span-5 card bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-fintech space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="min-w-0 flex-1 pr-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-text truncate">
                  {t('topDebtors')}
                </h2>
                <p className="text-xs text-muted truncate">
                  {t('whatsappQuickRecovery')}
                </p>
              </div>
              <Link
                href="/customers"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 shrink-0"
              >
                <span>{t('viewAll')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List */}
            {topDebtors.length === 0 ? (
              <div className="py-8 text-center space-y-3 bg-surface-2/50 rounded-2xl border border-border p-4">
                <div className="w-12 h-12 rounded-2xl bg-wasooli-soft text-wasooli flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">{t('allClear')}</p>
                  <p className="text-xs text-muted mt-0.5">{t('noPendingCredit')}</p>
                </div>
                <Link
                  href="/customers"
                  className="inline-block text-xs font-bold text-primary hover:underline"
                >
                  {t('addFirstCustomer')}
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {topDebtors.map((debtor) => {
                  const avatarColor = getAvatarColor(debtor.name);
                  const initials = getInitials(debtor.name);

                  return (
                    <div
                      key={debtor.id}
                      className="p-3 rounded-2xl bg-surface-2 hover:bg-surface border border-border/80 transition-all flex items-center justify-between gap-2.5 sm:gap-3"
                    >
                      <Link
                        href={`/customers/${debtor.id}`}
                        className="min-w-0 flex-1 flex items-center gap-2.5 sm:gap-3 group"
                      >
                        <div className={`w-9 h-9 rounded-xl ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-text group-hover:text-primary transition-colors truncate">
                            {debtor.name}
                          </p>
                          <p className="text-[11px] text-muted truncate">
                            {debtor.phone}
                          </p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-heading font-bold text-xs sm:text-sm text-udhaar tabular-nums">
                          {formatMoney(debtor.balance, lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setWhatsappCustomer(debtor)}
                          className="p-2 rounded-xl bg-wasooli-soft hover:bg-wasooli/20 text-wasooli transition active:scale-90 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          title={t('sendWhatsappReminder')}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            <Link
              href="/customers"
              className="action-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-surface-2 hover:bg-surface text-text text-xs font-bold transition min-h-[44px]"
            >
              <Users className="w-4 h-4 text-muted" />
              <span>{t('viewAllCustomers', { total: totalCustomers })}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="card bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-fintech space-y-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-text truncate">
              {t('recentTransactions')}
            </h2>
            <p className="text-xs text-muted truncate">
              {t('recentTransactionsSub')}
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>{t('fullHistory')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-10 sm:py-12 text-center space-y-3 bg-surface-2/40 rounded-2xl border border-dashed border-border p-4 sm:p-6">
            <div className="w-12 h-12 rounded-2xl bg-surface-2 text-muted flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">{t('noTxnYet')}</p>
              <p className="text-xs text-muted mt-1">{t('noTxnYetSub')}</p>
            </div>
            <button
              type="button"
              onClick={() => openTxn('udhaar')}
              className="action-btn sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow-primary active:scale-95 transition min-h-[44px] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('recordFirstEntry')}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {recentTransactions.map((txn) => {
              const isUdhaar = txn.type === 'udhaar';
              const avatarColor = getAvatarColor(txn.customerName || 'G');
              const initials = getInitials(txn.customerName || 'G');

              return (
                <div
                  key={txn.id || txn._id}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-3 hover:bg-surface-2/50 px-1 sm:px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-text truncate">
                        {txn.customerName}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {txn.note || (isUdhaar ? t('creditKhata') : t('cashRecovery'))} • {formatDate(txn.date, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span
                      className={`font-heading font-extrabold text-xs sm:text-base tabular-nums ${
                        isUdhaar ? 'text-udhaar' : 'text-wasooli'
                      }`}
                    >
                      {isUdhaar ? '-' : '+'} {formatMoney(txn.amount, lang)}
                    </span>
                    <span className={`inline-block text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-md mt-0.5 ${
                      isUdhaar ? 'bg-udhaar-soft text-udhaar' : 'bg-wasooli-soft text-wasooli'
                    }`}>
                      {isUdhaar ? t('credit') : t('recovery')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Transaction Modal */}
      <QuickTransactionModal
        isOpen={txnModalOpen}
        initialType={txnType}
        onClose={() => setTxnModalOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />

      {/* WhatsApp Reminder Modal */}
      <WhatsAppModal
        customer={whatsappCustomer}
        shopName={user?.shopName}
        isOpen={Boolean(whatsappCustomer)}
        onClose={() => setWhatsappCustomer(null)}
      />
    </div>
  );
}
