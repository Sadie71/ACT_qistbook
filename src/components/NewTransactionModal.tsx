import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, User, Phone, Calendar, FileText, Check, Sparkles } from 'lucide-react';
import { Customer, Language, TransactionType } from '../types';
import { translations } from '../i18n';

interface NewTransactionModalProps {
  customers: Customer[];
  selectedCustomerId?: string;
  defaultType?: TransactionType;
  language: Language;
  onClose: () => void;
  onSubmit: (data: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    type: TransactionType;
    amount: number;
    date: string;
    notes: string;
    itemsSummary?: string;
    dueDate?: string;
    sendWhatsApp?: boolean;
  }) => Promise<void>;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  customers,
  selectedCustomerId,
  defaultType = 'UDHAAR',
  language,
  onClose,
  onSubmit
}) => {
  const t = translations[language];
  const [type, setType] = useState<TransactionType>(defaultType);
  const [mode, setMode] = useState<'existing' | 'new'>(selectedCustomerId ? 'existing' : customers.length > 0 ? 'existing' : 'new');
  const [customerId, setCustomerId] = useState(selectedCustomerId || (customers[0]?.id || ''));
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [sendWhatsApp, setSendWhatsApp] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync selected customer info
  useEffect(() => {
    if (mode === 'existing' && customerId) {
      const found = customers.find(c => c.id === customerId);
      if (found) {
        setCustomerName(found.name);
        setCustomerPhone(found.phone);
      }
    }
  }, [customerId, mode, customers]);

  const handleQuickAmount = (val: number) => {
    const current = Number(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage(language === 'ur' ? 'Baraye meherbani 0 se zyada durust rakam darj karein.' : 'Please enter a positive amount greater than 0.');
      return;
    }

    const finalName = mode === 'existing' ? customerName : customerName.trim();
    if (!finalName) {
      setErrorMessage(language === 'ur' ? 'Grahak ka naam likhna zaroori hai.' : 'Customer name is required.');
      return;
    }

    // Phone validation if new customer mode and phone is provided
    if (mode === 'new' && customerPhone.trim()) {
      const cleanPhone = customerPhone.replace(/[\s\-\(\)]/g, '');
      if (cleanPhone.length < 10) {
        setErrorMessage(language === 'ur' ? 'Baraye meherbani durust 11-hindsay phone number darj karein (e.g. 03001234567).' : 'Please enter a valid phone number (at least 10-11 digits).');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerId: mode === 'existing' ? customerId : undefined,
        customerName: finalName,
        customerPhone: customerPhone.trim(),
        type,
        amount: numAmount,
        date,
        notes: notes.trim(),
        itemsSummary: notes.trim(),
        dueDate: dueDate || undefined,
        sendWhatsApp
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="new-transaction-modal"
        className="bg-[#fcfaf2] w-full max-w-lg rounded-2xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-[#2d5a3d] text-amber-50 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${type === 'UDHAAR' ? 'bg-rose-500/30 text-rose-200' : 'bg-emerald-500/30 text-emerald-200'}`}>
              {type === 'UDHAAR' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-amber-50">
                {type === 'UDHAAR' ? t.nayaUdhaarTitle : t.wasooliTitle}
              </h2>
              <p className="text-xs text-emerald-100/80">
                {type === 'UDHAAR' ? 'Dukan se saman udhaar diya' : 'Grahak se cash ya online wasooli aai'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-amber-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transaction Type Switcher */}
        <div className="p-4 bg-white border-b border-stone-200">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#f5f3e8] rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setType('UDHAAR')}
              className={`py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                type === 'UDHAAR'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{language === 'ur' ? 'Udhaar Diya (Debit)' : 'Credit Given'}</span>
            </button>

            <button
              type="button"
              onClick={() => setType('WASOOLI')}
              className={`py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                type === 'WASOOLI'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>{language === 'ur' ? 'Wasooli Aai (Credit)' : 'Payment Received'}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Customer Selection or Creation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-800">
                {t.grahakName}
              </label>
              {customers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMode(mode === 'existing' ? 'new' : 'existing')}
                  className="text-xs font-bold text-[#2d5a3d] hover:underline cursor-pointer"
                >
                  {mode === 'existing' ? '+ Naya Grahak' : 'Mojooda Grahak Chunein'}
                </button>
              )}
            </div>

            {mode === 'existing' && customers.length > 0 ? (
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-[#2d5a3d]/30"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — Baqi: Rs. {c.balance.toLocaleString()} ({c.phone || 'No phone'})
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={language === 'ur' ? 'Maslan: Chaudhry Akram' : 'E.g. John Doe'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#2d5a3d]/30"
                />
                <input
                  type="text"
                  placeholder={t.customerPhoneLabel}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 font-mono focus:ring-2 focus:ring-[#2d5a3d]/30"
                />
              </div>
            )}
          </div>

          {/* Amount Field + Quick Amount Chips */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
              {t.amountLabel} *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-stone-500">
                Rs.
              </span>
              <input
                type="number"
                step="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-3 py-2.5 text-lg font-black text-stone-900 focus:ring-2 focus:ring-[#2d5a3d]/30"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              {[500, 1000, 2000, 5000].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickAmount(chip)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#2d5a3d]/15 text-stone-800 hover:text-[#2d5a3d] border border-stone-200 text-xs font-bold transition cursor-pointer"
                >
                  +{chip.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                {t.dateLabel}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs text-stone-800 font-mono"
              />
            </div>

            {type === 'UDHAAR' && (
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {t.dueDateLabel}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs text-stone-800 font-mono"
                />
              </div>
            )}
          </div>

          {/* Notes / Items Summary */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              {t.itemNotesLabel}
            </label>
            <input
              type="text"
              placeholder={t.itemNotesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900"
            />
          </div>

          {/* WhatsApp toggle checkbox */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer">
            <input
              type="checkbox"
              checked={sendWhatsApp}
              onChange={(e) => setSendWhatsApp(e.target.checked)}
              className="w-4 h-4 text-[#2d5a3d] rounded-xs focus:ring-[#2d5a3d]"
            />
            <span className="text-xs font-medium text-emerald-950">
              {t.sendWhatsAppToggle}
            </span>
          </label>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 font-bold text-sm shadow-md transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Mehfooz Ho Raha Hai...' : t.saveBtn}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
