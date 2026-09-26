'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Search, 
  Trash2, 
  Calendar,
  RefreshCw,
  X,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { formatMoney, formatDate } from '@/lib/utils';
import { QuickTransactionModal } from '@/components/QuickTransactionModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { authFetch } from '@/lib/apiClient';

export default function TransactionsPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'udhaar' | 'wasooli'
  const [datePreset, setDatePreset] = useState('all'); // 'today' | 'week' | 'month' | 'all' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('udhaar');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCustomerId) params.set('customerId', selectedCustomerId);
      if (selectedType !== 'all') params.set('type', selectedType);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await authFetch(`/api/transactions?${params.toString()}`);
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [user, selectedCustomerId, selectedType, startDate, endDate, router, showToast]);

  const fetchCustomers = useCallback(async () => {
    if (!user) return;
    try {
      const res = await authFetch('/api/customers');
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user, fetchCustomers]);

  // Quick date presets logic
  const handleDatePreset = (preset) => {
    setDatePreset(preset);
    const now = new Date();
    const toDateStr = (d) => d.toISOString().split('T')[0];

    if (preset === 'today') {
      const todayStr = toDateStr(now);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'week') {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      setStartDate(toDateStr(start));
      setEndDate(toDateStr(now));
    } else if (preset === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(toDateStr(start));
      setEndDate(toDateStr(now));
    } else if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await authFetch(`/api/transactions/${deleteTarget.id || deleteTarget._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      showToast(t('entryDeleted'), 'success');
      setTransactions((prev) => prev.filter((t) => (t.id || t._id) !== (deleteTarget.id || deleteTarget._id)));
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      txn.customerName?.toLowerCase().includes(term) ||
      txn.note?.toLowerCase().includes(term) ||
      txn.customerPhone?.includes(term)
    );
  });

  // Calculate totals for summary bar
  const totalUdhaar = filteredTransactions
    .filter((tx) => tx.type === 'udhaar')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalWasooli = filteredTransactions
    .filter((tx) => tx.type === 'wasooli')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const netDifference = totalWasooli - totalUdhaar;

  const datePresetLabels = {
    today: t('presetToday'),
    week: t('presetWeek'),
    month: t('presetMonth'),
    all: t('presetAll'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1">
        <div className="min-w-0">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-text tracking-tight truncate">
            {t('transactions')}
          </h1>
          <p className="text-xs text-muted font-medium mt-0.5 truncate">
            {t('transactionsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              setModalType('udhaar');
              setModalOpen(true);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-udhaar text-white font-heading font-bold text-xs sm:text-sm shadow-fintech active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
            <span>{t('btnCreditGiven')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModalType('wasooli');
              setModalOpen(true);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-xs sm:text-sm shadow-glow-primary active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>{t('btnPaymentReceived')}</span>
          </button>
          <button
            type="button"
            onClick={fetchTransactions}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-surface border border-border text-muted hover:text-text hover:bg-surface-2 transition flex items-center justify-center shadow-fintech min-h-[40px] min-w-[40px]"
            title={t('refresh')}
          >
            <RefreshCw className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Summary Pill Bar */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-surface border border-border shadow-fintech">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:px-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-wider block">
                {t('totalUdhaarSummary')}
              </span>
              <div className="font-heading font-extrabold text-base sm:text-xl text-udhaar tabular-nums">
                {formatMoney(totalUdhaar, lang)}
              </div>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-udhaar-soft text-udhaar flex items-center justify-center sm:ml-auto shrink-0">
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3 pt-3 sm:pt-0 sm:px-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-wider block">
                {t('totalWasooliSummary')}
              </span>
              <div className="font-heading font-extrabold text-base sm:text-xl text-wasooli tabular-nums">
                {formatMoney(totalWasooli, lang)}
              </div>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-wasooli-soft text-wasooli flex items-center justify-center sm:ml-auto shrink-0">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3 pt-3 sm:pt-0 sm:px-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-wider block">
                {t('netDifference')}
              </span>
              <div className={`font-heading font-extrabold text-base sm:text-xl tabular-nums ${
                netDifference >= 0 ? 'text-wasooli' : 'text-udhaar'
              }`}>
                {netDifference >= 0 ? '+' : ''}{formatMoney(netDifference, lang)}
              </div>
            </div>
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center sm:ml-auto shrink-0 ${
              netDifference >= 0 ? 'bg-wasooli-soft text-wasooli' : 'bg-udhaar-soft text-udhaar'
            }`}>
              {netDifference >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-3.5 sm:p-5 bg-surface rounded-2xl border border-border shadow-fintech space-y-3.5">
        {/* Type Filter Pills with soft semantic tints */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[38px] ${
              selectedType === 'all'
                ? 'bg-surface-2 text-text border border-border shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            {t('filterAll')} ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('udhaar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[38px] flex items-center gap-1.5 ${
              selectedType === 'udhaar'
                ? 'bg-udhaar-soft text-udhaar border border-udhaar/30 shadow-xs'
                : 'text-muted hover:text-udhaar'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t('filterUdhaar')}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('wasooli')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[38px] flex items-center gap-1.5 ${
              selectedType === 'wasooli'
                ? 'bg-wasooli-soft text-wasooli border border-wasooli/30 shadow-xs'
                : 'text-muted hover:text-wasooli'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t('filterWasooli')}</span>
          </button>
        </div>

        {/* Quick Date Presets */}
        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          <span className="text-xs font-bold text-muted mr-1">{t('dateFilterLabel')}</span>
          {['today', 'week', 'month', 'all'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleDatePreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                datePreset === p
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              {datePresetLabels[p]}
            </button>
          ))}
        </div>

        {/* Search, Customer Select and Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Search by Customer name or Note */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchTxnPlaceholder')}
              className="w-full h-11 pl-10 pr-8 text-xs rounded-xl bg-surface-2 border border-border focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-text outline-none transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Customer Dropdown */}
          <div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full h-11 px-3 text-xs rounded-xl bg-surface-2 border border-border focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-text outline-none transition"
            >
              <option value="">{t('allCustomersDropdown', { total: customers.length })}</option>
              {customers.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Date range inputs */}
          <div className="grid grid-cols-2 gap-2 sm:col-span-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset('custom');
              }}
              className="w-full min-w-0 h-11 px-2.5 sm:px-3 text-xs rounded-xl bg-surface-2 border border-border text-text outline-none"
              title="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset('custom');
              }}
              className="w-full min-w-0 h-11 px-2.5 sm:px-3 text-xs rounded-xl bg-surface-2 border border-border text-text outline-none"
              title="End Date"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-surface rounded-2xl border border-border p-4" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-surface rounded-3xl border border-border shadow-fintech">
            <div className="w-14 h-14 rounded-2xl bg-surface-2 text-muted flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-text">{t('noData')}</p>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {t('noTransactionsFound')}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((txn) => {
              const isUdhaar = txn.type === 'udhaar';

              return (
                <div
                  key={txn.id || txn._id}
                  className="bg-surface rounded-2xl border border-border p-4 shadow-fintech flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-border/80 transition"
                >
                  {/* Left: Direction Icon, Customer details, Note & Date */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isUdhaar
                          ? 'bg-udhaar-soft text-udhaar'
                          : 'bg-wasooli-soft text-wasooli'
                      }`}
                    >
                      {isUdhaar ? (
                        <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {txn.customerId ? (
                          <Link
                            href={`/customers/${txn.customerId}`}
                            className="font-heading font-bold text-sm sm:text-base text-text hover:text-primary transition"
                          >
                            {txn.customerName}
                          </Link>
                        ) : (
                          <span className="font-heading font-bold text-sm sm:text-base text-text">
                            {txn.customerName}
                          </span>
                        )}
                        <span
                          className={`font-heading font-bold text-[10px] uppercase px-2 py-0.5 rounded-md ${
                            isUdhaar
                              ? 'bg-udhaar-soft text-udhaar'
                              : 'bg-wasooli-soft text-wasooli'
                          }`}
                        >
                          {isUdhaar ? t('credit') : t('recovery')}
                        </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-2 text-xs text-muted mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(txn.date, lang)}</span>
                        </span>
                        {txn.customerPhone && (
                          <span>• {txn.customerPhone}</span>
                        )}
                      </div>
                      {txn.note && (
                        <p className="text-xs text-muted italic mt-1 max-w-md">
                          &quot;{txn.note}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Big Bold Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    <div className="text-left sm:text-right">
                      <div
                        className={`font-heading font-extrabold text-base sm:text-xl tabular-nums ${
                          isUdhaar ? 'text-udhaar' : 'text-wasooli'
                        }`}
                      >
                        {isUdhaar ? '-' : '+'} {formatMoney(txn.amount, lang)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(txn)}
                      className="w-9 h-9 rounded-xl text-muted hover:text-udhaar hover:bg-udhaar-soft transition flex items-center justify-center"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Transaction Modal */}
      <QuickTransactionModal
        isOpen={modalOpen}
        initialType={modalType}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchTransactions()}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={t('deleteConfirmTxn')}
        message={t('deleteTxnWarning')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
