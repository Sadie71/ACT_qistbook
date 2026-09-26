'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isDanger = true }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface w-full max-w-sm rounded-t-3xl sm:rounded-2xl shadow-fintech-lg border border-border p-5 space-y-4 text-text transition-all">
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1.5 rounded-full bg-border mx-auto -mt-1 mb-2" />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-udhaar/15 text-udhaar flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-base text-text">
              {title || t('delete')}
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted hover:text-text hover:bg-surface-2 transition min-h-[44px]"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition active:scale-95 min-h-[44px] cursor-pointer ${
              isDanger ? 'bg-udhaar hover:bg-rose-700 shadow-glow-udhaar' : 'bg-primary hover:bg-primary-dark shadow-glow-primary'
            }`}
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
