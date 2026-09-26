'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  MapPin, 
  MessageSquare, 
  ChevronRight, 
  Trash2, 
  X
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { formatMoney, getAvatarColor, getInitials } from '@/lib/utils';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { authFetch } from '@/lib/apiClient';

export default function CustomersPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'debtor' | 'clear'

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    initialBalance: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const [whatsappCustomer, setWhatsappCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCustomers = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await authFetch('/api/customers');
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to load customers');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [user, router, showToast]);

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user, fetchCustomers]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast(t('namePhoneRequired'), 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add customer');

      showToast(t('customerAddedSuccess', { name: formData.name }), 'success');
      setFormData({
        name: '',
        phone: '',
        address: '',
        notes: '',
        initialBalance: '',
      });
      setAddModalOpen(false);
      fetchCustomers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await authFetch(`/api/customers/${deleteTarget.id || deleteTarget._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete customer');

      showToast(t('customerDeletedSuccess'), 'success');
      setCustomers((prev) =>
        prev.filter((c) => (c.id || c._id) !== (deleteTarget.id || deleteTarget._id))
      );
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filtered = customers.filter((c) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(term);
      const matchPhone = c.phone?.includes(term);
      const matchAddress = c.address?.toLowerCase().includes(term);
      if (!matchName && !matchPhone && !matchAddress) return false;
    }

    if (statusFilter === 'debtor') {
      return (c.balance || 0) > 0;
    }
    if (statusFilter === 'clear') {
      return (c.balance || 0) <= 0;
    }
    return true;
  });

  const totalOutstanding = customers.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
  const debtorCount = customers.filter((c) => (c.balance || 0) > 0).length;
  const clearCount = customers.filter((c) => (c.balance || 0) <= 0).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1">
        <div className="min-w-0">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-text tracking-tight truncate">
            {t('customerListTitle')}
          </h1>
          <p className="text-xs text-muted font-medium mt-0.5 truncate">
            {t('customerCountSubtitle', {
              count: customers.length,
              balance: formatMoney(totalOutstanding, lang),
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-xs sm:text-sm shadow-glow-primary active:scale-95 transition cursor-pointer min-h-[44px] shrink-0"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('addNewCustomer')}</span>
        </button>
      </div>

      {/* Search Input Bar & Segmented Filter Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchCustomerPlaceholder')}
            className="w-full h-12 pl-10 sm:pl-11 pr-10 text-xs sm:text-sm rounded-2xl bg-surface border border-border shadow-fintech focus:border-primary focus:ring-2 focus:ring-primary/40 text-text outline-none transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted hover:text-text hover:bg-surface-2 transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Segmented Control Tabs */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-surface-2 border border-border max-w-md">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all min-h-[38px] flex items-center justify-center text-center ${
              statusFilter === 'all'
                ? 'bg-surface text-text shadow-fintech'
                : 'text-muted hover:text-text'
            }`}
          >
            <span className="truncate">{t('filterAllCustomers', { count: customers.length })}</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('debtor')}
            className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all min-h-[38px] flex items-center justify-center text-center ${
              statusFilter === 'debtor'
                ? 'bg-udhaar-soft text-udhaar border border-udhaar/30 shadow-xs'
                : 'text-muted hover:text-udhaar'
            }`}
          >
            <span className="truncate">{t('filterDebtors', { count: debtorCount })}</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('clear')}
            className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all min-h-[38px] flex items-center justify-center text-center ${
              statusFilter === 'clear'
                ? 'bg-wasooli-soft text-wasooli border border-wasooli/30 shadow-xs'
                : 'text-muted hover:text-wasooli'
            }`}
          >
            <span className="truncate">{t('filterClear', { count: clearCount })}</span>
          </button>
        </div>
      </div>

      {/* Customer Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-surface rounded-2xl border border-border p-4" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-border p-12 text-center space-y-4 shadow-fintech">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 text-muted flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-text">
              {searchTerm ? t('noCustomerFoundSearch') : t('noCustomersYet')}
            </h3>
            <p className="text-xs text-muted mt-1">
              {searchTerm ? t('noCustomerSearchSub') : t('noCustomerEmptySub')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-glow-primary active:scale-95 transition"
          >
            {t('addNewCustomer')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => {
            const hasBalance = (customer.balance || 0) > 0;
            const isZero = (customer.balance || 0) === 0;
            const avatarColor = getAvatarColor(customer.name);
            const initials = getInitials(customer.name);

            return (
              <div
                key={customer.id || customer._id}
                className="bg-surface rounded-2xl border border-border shadow-fintech p-4 sm:p-5 flex flex-col justify-between hover:border-border/80 hover:-translate-y-0.5 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center font-heading font-bold text-sm shrink-0 shadow-xs`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/customers/${customer.id || customer._id}`}
                          className="font-heading font-bold text-sm sm:text-base text-text hover:text-primary transition truncate block"
                        >
                          {customer.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-primary" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Balance Status Badge */}
                    <div className="text-right shrink-0">
                      <div
                        className={`font-heading font-extrabold text-sm sm:text-base tabular-nums ${
                          hasBalance
                            ? 'text-udhaar'
                            : isZero
                            ? 'text-wasooli'
                            : 'text-primary'
                        }`}
                      >
                        {formatMoney(customer.balance, lang)}
                      </div>
                      <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                        hasBalance
                          ? 'bg-udhaar-soft text-udhaar'
                          : isZero
                          ? 'bg-wasooli-soft text-wasooli'
                          : 'bg-primary-soft text-primary'
                      }`}>
                        {hasBalance
                          ? t('owesMoney')
                          : isZero
                          ? t('clearedBadge')
                          : t('advanceBadge')}
                      </span>
                    </div>
                  </div>

                  {customer.address && (
                    <div className="flex items-center gap-1.5 text-xs text-muted mt-3 pt-2.5 border-t border-border/60">
                      <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {hasBalance && (
                      <button
                        type="button"
                        onClick={() => setWhatsappCustomer(customer)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-wasooli-soft hover:bg-wasooli/20 text-wasooli text-xs font-bold transition active:scale-95 cursor-pointer min-h-[36px]"
                        title={t('sendReminder')}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(customer)}
                      className="w-9 h-9 rounded-xl text-muted hover:text-udhaar hover:bg-udhaar-soft transition flex items-center justify-center"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    href={`/customers/${customer.id || customer._id}`}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline transition py-1.5"
                  >
                    <span>{t('viewLedger')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Customer Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-fintech-lg border border-border overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] text-text transition-all">
            <div className="sm:hidden w-12 h-1.5 rounded-full bg-border mx-auto mt-3 mb-1" />

            <div className="px-5 py-3.5 sm:py-4 border-b border-border flex items-center justify-between bg-surface-2/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-dark to-primary text-white flex items-center justify-center shadow-fintech">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-text">
                  {t('addNewCustomer')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                aria-label="Close modal"
                className="w-10 h-10 rounded-xl text-muted hover:text-text hover:bg-surface-2 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Malik Tariq"
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerPhone')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="03001234567"
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerAddress')}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Street 4, Main Bazaar"
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('customerNotes')}
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Monthly groceries, settles on 5th"
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  {t('initialBalanceLabel')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                  placeholder="0"
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm font-bold text-text outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-bold text-sm shadow-glow-primary transition active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? t('loading') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      <WhatsAppModal
        customer={whatsappCustomer}
        shopName={user?.shopName}
        isOpen={Boolean(whatsappCustomer)}
        onClose={() => setWhatsappCustomer(null)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={t('deleteConfirmCust')}
        message={t('deleteCustWarning', { name: deleteTarget?.name })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
