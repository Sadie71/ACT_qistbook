'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Plus, UserPlus } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import { useLanguage } from './LanguageProvider';
import { useToast } from './ToastProvider';
import { authFetch } from '@/lib/apiClient';

export function QuickTransactionModal({
  isOpen,
  onClose,
  initialType = 'udhaar',
  preselectedCustomerId = null,
  onSuccess,
}) {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [type, setType] = useState(initialType);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(preselectedCustomerId || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // In-modal quick customer creation
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  useEffect(() => {
    if (preselectedCustomerId) {
      setCustomerId(preselectedCustomerId);
    }
  }, [preselectedCustomerId]);

  useEffect(() => {
    if (isOpen) {
      authFetch('/api/customers')
        .then((res) => res.json())
        .then((data) => {
          if (data.customers) {
            setCustomers(data.customers);
            if (!customerId && data.customers.length > 0) {
              setCustomerId(data.customers[0].id || data.customers[0]._id);
            }
          }
        })
        .catch((err) => console.error('Error fetching customers:', err));
    }
  }, [isOpen, customerId]);

  if (!isOpen) return null;

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) {
      showToast(t('namePhoneRequired'), 'error');
      return;
    }
    setCreatingCustomer(true);
    try {
      const res = await authFetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCustName, phone: newCustPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add customer');

      showToast(t('customerAddedSuccess', { name: newCustName }), 'success');
      setCustomers((prev) => [data.customer, ...prev]);
      setCustomerId(data.customer.id || data.customer._id);
      setShowAddCustomer(false);
      setNewCustName('');
      setNewCustPhone('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCreatingCustomer(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      showToast(t('selectCustomerRequired'), 'error');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      showToast(t('validAmountRequired'), 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          type,
          amount: Number(amount),
          note,
          date,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record entry');

      showToast(
        type === 'udhaar'
          ? t('creditGivenSuccess')
          : t('paymentReceivedSuccess'),
        'success'
      );
      setAmount('');
      setNote('');
      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-fintech-lg border border-border overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] text-text transition-all">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 rounded-full bg-border mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b border-border flex items-center justify-between bg-surface-2/60">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                type === 'udhaar' ? 'bg-udhaar shadow-xs' : 'bg-wasooli shadow-xs'
              }`}
            >
              {type === 'udhaar' ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-text">
                {t('recordTransaction')}
              </h3>
              <p className="text-[11px] text-muted">
                {type === 'udhaar' ? t('typeUdhaar') : t('typeWasooli')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-xl text-muted hover:text-text hover:bg-surface-2 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Type Toggle Segmented Control */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-2 border border-border">
            <button
              type="button"
              onClick={() => setType('udhaar')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                type === 'udhaar'
                  ? 'bg-gradient-to-r from-udhaar to-rose-600 text-white shadow-glow-udhaar'
                  : 'text-muted hover:text-text'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>{t('typeUdhaar')}</span>
            </button>
            <button
              type="button"
              onClick={() => setType('wasooli')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                type === 'wasooli'
                  ? 'bg-gradient-to-r from-wasooli to-emerald-600 text-white shadow-glow-wasooli'
                  : 'text-muted hover:text-text'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{t('typeWasooli')}</span>
            </button>
          </div>

          {/* Amount Field (Extra Large and Centered) */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5 text-center">
              {t('amount')} ({lang === 'ur' ? 'Pakistani Rupee' : 'PKR'})
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full h-16 px-4 rounded-2xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-3xl sm:text-4xl font-extrabold text-center tabular-nums text-text outline-none transition"
              />
            </div>
          </div>

          {/* Customer Selection or Inline Add */}
          {!showAddCustomer ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">
                  {t('selectCustomer')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 min-h-[36px] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addNewCustomer')}</span>
                </button>
              </div>

              {customers.length === 0 ? (
                <div className="p-3 bg-warning/15 rounded-xl border border-warning/30 text-xs text-text flex items-center justify-between">
                  <span>{t('pleaseAddCustomerFirst')}</span>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(true)}
                    className="underline font-bold text-warning cursor-pointer"
                  >
                    {t('addNewCustomer')}
                  </button>
                </div>
              ) : (
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
                >
                  {customers.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.name} ({c.phone}) - {t('runningBalance')}: {formatMoney(c.balance || 0, lang)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-primary" />
                  {t('addNewCustomer')}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="text-xs text-muted hover:underline cursor-pointer"
                >
                  {t('cancel')}
                </button>
              </div>
              <input
                type="text"
                placeholder={t('customerNamePlaceholder')}
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                className="w-full h-11 px-3.5 text-xs bg-surface rounded-xl border border-border text-text outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder={t('customerPhonePlaceholder')}
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                className="w-full h-11 px-3.5 text-xs bg-surface rounded-xl border border-border text-text outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleCreateCustomer}
                disabled={creatingCustomer}
                className="w-full h-10 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition disabled:opacity-60 cursor-pointer"
              >
                {creatingCustomer ? t('loading') : t('saveCustomerBtn')}
              </button>
            </div>
          )}

          {/* Note / Item Description */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('note')}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('notePlaceholder')}
              className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-3.5 rounded-xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text outline-none transition"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-13 rounded-2xl text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer ${
                type === 'udhaar'
                  ? 'bg-gradient-to-r from-udhaar to-rose-600 shadow-glow-udhaar'
                  : 'bg-gradient-to-r from-primary-dark to-primary shadow-glow-primary'
              }`}
            >
              {loading ? t('loading') : `${t('save')} (${type === 'udhaar' ? t('credit') : t('recovery')})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
