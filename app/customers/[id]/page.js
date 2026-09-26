'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Phone, 
  FileText, 
  Printer, 
  Download, 
  MessageSquare, 
  ArrowDownRight, 
  ArrowUpRight, 
  Trash2, 
  Edit3, 
  X,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { formatMoney, formatDate, formatDateTime, getAvatarColor, getInitials } from '@/lib/utils';
import { QuickTransactionModal } from '@/components/QuickTransactionModal';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { authFetch } from '@/lib/apiClient';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [txnModalOpen, setTxnModalOpen] = useState(false);
  const [txnType, setTxnType] = useState('udhaar');
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteTxnTarget, setDeleteTxnTarget] = useState(null);

  // Edit Customer State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchCustomerDetails = useCallback(async () => {
    if (!user || !id) return;
    try {
      setLoading(true);
      setError('');
      const res = await authFetch(`/api/customers/${id}`);
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || t('customerNotFound'));
      }
      const data = await res.json();
      setCustomer(data.customer);

      setEditName(data.customer.name);
      setEditPhone(data.customer.phone);
      setEditAddress(data.customer.address || '');
      setEditNotes(data.customer.notes || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, id, router, t]);

  useEffect(() => {
    if (id && user) {
      fetchCustomerDetails();
    }
  }, [id, user, fetchCustomerDetails]);

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await authFetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          address: editAddress,
          notes: editNotes,
        }),
      });
      if (!res.ok) throw new Error('Failed to update customer details');
      showToast(t('customerUpdatedSuccess'), 'success');
      setEditModalOpen(false);
      fetchCustomerDetails();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteTxn = async () => {
    if (!deleteTxnTarget) return;
    try {
      const res = await authFetch(`/api/transactions/${deleteTxnTarget.id || deleteTxnTarget._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      showToast(t('entryDeleted'), 'success');
      setDeleteTxnTarget(null);
      fetchCustomerDetails();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Export CSV statement
  const exportCSV = () => {
    if (!customer || !customer.transactions) return;

    const headers = [t('date'), t('transactionType'), t('note'), t('amount'), t('runningBalance')];
    const rows = customer.transactions.map((tx) => [
      `"${formatDate(tx.date, lang)}"`,
      `"${tx.type === 'udhaar' ? t('typeUdhaar') : t('typeWasooli')}"`,
      `"${(tx.note || '').replace(/"/g, '""')}"`,
      tx.amount,
      tx.balanceAfter,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Khata_${customer.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !customer) {
    return (
      <div className="p-12 text-center text-sm font-medium text-muted animate-pulse">
        {t('loading')}
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8 text-center space-y-4 bg-surface rounded-3xl border border-udhaar/30 shadow-fintech max-w-md mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-udhaar-soft text-udhaar flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-udhaar">{error || t('customerNotFound')}</p>
        <button
          type="button"
          onClick={() => router.push('/customers')}
          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-glow-primary active:scale-95 transition"
        >
          {t('backToCustomerList')}
        </button>
      </div>
    );
  }

  const avatarColor = getAvatarColor(customer.name);
  const initials = getInitials(customer.name);
  const hasBalance = (customer.balance || 0) > 0;
  const isZero = (customer.balance || 0) === 0;

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 no-print pb-1">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link
            href="/customers"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-surface border border-border text-muted hover:text-text hover:bg-surface-2 transition flex items-center justify-center shadow-fintech shrink-0 min-h-[40px] min-w-[40px]"
            title={t('back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-text tracking-tight truncate">
                {customer.name}
              </h1>
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="p-1.5 rounded-xl text-muted hover:text-text hover:bg-surface-2 transition shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                title={t('edit')}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted font-medium mt-0.5 truncate">
              {customer.phone} {customer.address ? `• ${customer.address}` : ''}
            </p>
          </div>
        </div>

        {/* Quick Utility Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-surface border border-border text-muted hover:text-text hover:bg-surface-2 transition flex items-center justify-center shadow-fintech min-h-[40px] min-w-[40px]"
            title={t('printLedger')}
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-surface border border-border text-muted hover:text-text hover:bg-surface-2 transition flex items-center justify-center shadow-fintech min-h-[40px] min-w-[40px]"
            title={t('exportCsv')}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Header (Visible during Print only) */}
      <div className="hidden print-only mb-6 border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user?.shopName}</h1>
            <p className="text-xs text-gray-500">{t('printDukandarInfo', { name: user?.name })}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">{customer.name}</h2>
            <p className="text-xs text-gray-500">Phone: {customer.phone}</p>
            <p className="text-xs text-gray-500">{t('printDate')} {formatDate(new Date(), lang)}</p>
          </div>
        </div>
      </div>

      {/* Customer Summary Card */}
      <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border shadow-fintech-lg p-4 sm:p-7 relative overflow-hidden">
        <div className={`absolute -right-16 -top-16 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none ${
          hasBalance ? 'bg-udhaar' : 'bg-wasooli'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center font-heading font-extrabold text-xl sm:text-3xl shrink-0 shadow-fintech`}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                <span className={`inline-block text-[10px] sm:text-[11px] uppercase font-extrabold px-2 py-0.5 rounded-lg ${
                  hasBalance
                    ? 'bg-udhaar-soft text-udhaar border border-udhaar/20'
                    : isZero
                    ? 'bg-wasooli-soft text-wasooli border border-wasooli/20'
                    : 'bg-primary-soft text-primary'
                }`}>
                  {hasBalance ? t('owesMoney') : isZero ? t('clearedBadge') : t('advanceBadge')}
                </span>
                <span className="text-[11px] sm:text-xs text-muted font-semibold">
                  {customer.transactions?.length || 0} {t('entries')}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-muted uppercase font-bold tracking-wider mt-1.5 sm:mt-2">
                {t('runningBalance')}
              </div>
              <div
                className={`font-heading font-extrabold text-2xl sm:text-4xl tabular-nums tracking-tight mt-0.5 truncate ${
                  hasBalance
                    ? 'text-udhaar'
                    : isZero
                    ? 'text-wasooli'
                    : 'text-primary'
                }`}
              >
                {formatMoney(customer.balance, lang)}
              </div>
            </div>
          </div>

          {/* Quick Call & WhatsApp Reminder & Transaction Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-1 lg:pt-0">
            <a
              href={`tel:${customer.phone}`}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-surface-2 hover:bg-surface border border-border text-text font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{t('call')}</span>
            </a>

            <button
              type="button"
              onClick={() => setWhatsappOpen(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-wasooli-soft hover:bg-wasooli/20 border border-wasooli/30 text-wasooli font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTxnType('udhaar');
                setTxnModalOpen(true);
              }}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-udhaar text-white font-heading font-bold text-xs sm:text-sm shadow-fintech active:scale-95 transition cursor-pointer min-h-[44px]"
            >
              <ArrowDownRight className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span className="truncate">{t('btnCreditGiven')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTxnType('wasooli');
                setTxnModalOpen(true);
              }}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-xs sm:text-sm shadow-glow-primary active:scale-95 transition cursor-pointer min-h-[44px]"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span className="truncate">{t('btnPaymentReceived')}</span>
            </button>
          </div>
        </div>

        {/* Stats Row inside Hero */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-border">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-surface-2 border border-border/60">
            <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-wider block">
              {t('totalGiven')}
            </span>
            <div className="font-heading font-extrabold text-base sm:text-xl text-udhaar tabular-nums mt-0.5 truncate">
              {formatMoney(customer.totalUdhaar, lang)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted mt-0.5 truncate">{t('totalGoodsGivenSub')}</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-surface-2 border border-border/60">
            <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-wider block">
              {t('totalReceived')}
            </span>
            <div className="font-heading font-extrabold text-base sm:text-xl text-wasooli tabular-nums mt-0.5 truncate">
              {formatMoney(customer.totalWasooli, lang)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted mt-0.5 truncate">{t('totalPaymentReceivedSub')}</p>
          </div>
        </div>
      </div>

      {/* Customer Notes banner if present */}
      {customer.notes && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs sm:text-sm text-text flex items-start gap-2.5 no-print">
          <FileText className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-500">{t('specialNote')}</span> {customer.notes}
          </div>
        </div>
      )}

      {/* Transaction History Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-heading font-bold text-lg text-text">
            {t('ledgerTitle')}
          </h3>
          <span className="text-xs text-muted font-medium">
            {customer.transactions?.length || 0} {t('entries')}
          </span>
        </div>

        {customer.transactions?.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted bg-surface rounded-3xl border border-border shadow-fintech">
            {t('emptyCustomerLedger')}
          </div>
        ) : (
          <div className="space-y-3">
            {customer.transactions.map((txn) => {
              const isUdhaar = txn.type === 'udhaar';

              return (
                <div
                  key={txn.id || txn._id}
                  className="bg-surface rounded-2xl border border-border p-4 shadow-fintech flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-border/80 transition"
                >
                  {/* Left: Icon, Type, Note & Date */}
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
                        <span
                          className={`font-heading font-bold text-xs uppercase px-2 py-0.5 rounded-md ${
                            isUdhaar
                              ? 'bg-udhaar-soft text-udhaar'
                              : 'bg-wasooli-soft text-wasooli'
                          }`}
                        >
                          {isUdhaar ? t('credit') : t('recovery')}
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(txn.date, lang)}</span>
                        </span>
                      </div>
                      <p className="text-sm font-medium text-text mt-1">
                        {txn.note || (isUdhaar ? t('typeUdhaar') : t('typeWasooli'))}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount & Running Balance */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    <div className="text-left sm:text-right">
                      <div
                        className={`font-heading font-extrabold text-base sm:text-lg tabular-nums ${
                          isUdhaar ? 'text-udhaar' : 'text-wasooli'
                        }`}
                      >
                        {isUdhaar ? '-' : '+'} {formatMoney(txn.amount, lang)}
                      </div>
                      <span className="text-[11px] text-muted block">
                        {t('runningBalance')}: <span className="font-bold text-text tabular-nums">{formatMoney(txn.balanceAfter, lang)}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteTxnTarget(txn)}
                      className="w-9 h-9 rounded-xl text-muted hover:text-udhaar hover:bg-udhaar-soft transition flex items-center justify-center no-print"
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

      {/* Edit Customer Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-fintech-lg border border-border overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] text-text transition-all">
            <div className="sm:hidden w-12 h-1.5 rounded-full bg-border mx-auto mt-3 mb-1" />

            <div className="px-5 py-3.5 sm:py-4 border-b border-border flex items-center justify-between bg-surface-2/60">
              <h3 className="font-heading font-bold text-base text-text">
                {t('editCustomerTitle')}
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                aria-label="Close modal"
                className="w-10 h-10 rounded-xl text-muted hover:text-text hover:bg-surface-2 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCustomer} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerName')}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerPhone')}
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerAddress')}
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerNotes')}
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-bold text-sm shadow-glow-primary transition active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {savingEdit ? t('loading') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Transaction Modal preselected for this customer */}
      <QuickTransactionModal
        isOpen={txnModalOpen}
        initialType={txnType}
        preselectedCustomerId={customer.id || customer._id}
        onClose={() => setTxnModalOpen(false)}
        onSuccess={() => fetchCustomerDetails()}
      />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        customer={customer}
        shopName={user?.shopName}
        isOpen={whatsappOpen}
        onClose={() => setWhatsappOpen(false)}
      />

      {/* Delete Transaction Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTxnTarget)}
        title={t('deleteConfirmTxn')}
        message={t('deleteTxnWarning')}
        onConfirm={handleDeleteTxn}
        onCancel={() => setDeleteTxnTarget(null)}
      />
    </div>
  );
}
