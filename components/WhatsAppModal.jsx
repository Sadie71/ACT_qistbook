'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Phone } from 'lucide-react';
import { formatMoney, formatWhatsAppPhone, generateWhatsAppMessage } from '@/lib/utils';
import { useLanguage } from './LanguageProvider';
import { useToast } from './ToastProvider';

export function WhatsAppModal({ customer, shopName, isOpen, onClose }) {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [tone, setTone] = useState('polite');
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (customer && isOpen) {
      const generated = generateWhatsAppMessage(tone, {
        customerName: customer.name,
        shopName: shopName || 'QistBook Store',
        balance: customer.balance || 0,
      }, lang);
      setMessageText(generated);
    }
  }, [customer, shopName, tone, isOpen, lang]);

  if (!isOpen || !customer) return null;

  const cleanPhone = formatWhatsAppPhone(customer.phone);

  const handleSend = () => {
    if (!cleanPhone) {
      showToast(t('noValidPhone'), 'error');
      return;
    }
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-fintech-lg border border-border overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] text-text transition-all">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 rounded-full bg-border mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b border-border flex items-center justify-between bg-surface-2/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-wasooli text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-text">
                {t('whatsappModalTitle')}
              </h3>
              <p className="text-xs text-muted">
                {customer.name} ({customer.phone})
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

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Amount Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-udhaar/10 border border-udhaar/20">
            <span className="text-xs font-bold text-udhaar uppercase tracking-wider">{t('owesMoney')}:</span>
            <span className="font-heading font-extrabold text-lg text-udhaar tabular-nums">
              {formatMoney(customer.balance, lang)}
            </span>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              {t('reminderTone')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'friendly', label: t('toneFriendly') },
                { id: 'polite', label: t('tonePolite') },
                { id: 'firm', label: t('toneFirm') },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTone(item.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all min-h-[44px] ${
                    tone === item.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface-2 text-muted border-border hover:text-text hover:bg-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">
                {t('previewMessage')}
              </label>
              <span className="text-[11px] text-muted">{t('editableNotice')}</span>
            </div>
            <textarea
              rows={5}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-border bg-surface-2 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-sm text-text leading-relaxed outline-none transition resize-none"
            />
          </div>

          {/* Target Phone confirmation */}
          <div className="flex items-center gap-2 text-xs text-muted">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>Target: +{cleanPhone}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border bg-surface-2/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted hover:text-text hover:bg-surface-2 transition min-h-[44px]"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-wasooli to-emerald-600 hover:opacity-95 text-white text-xs font-bold shadow-glow-wasooli active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('sendOnWhatsApp')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
