import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, Heart, Store } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer id="app-footer" className="bg-[#111813] text-stone-300 border-t border-[#2d5a3d]/30 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2d5a3d] text-amber-50 flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span 
                className="font-serif italic font-extrabold text-xl tracking-tight text-amber-100"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                QistBook
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                LEDGER + AI
              </span>
            </div>

            <h3 className="font-bold text-sm text-stone-100">
              {t.footerTagline}
            </h3>

            <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
              {t.footerDescription}
            </p>
          </div>

          {/* Features highlight & Trust Badges */}
          <div className="md:col-span-6 flex flex-col sm:flex-row gap-6 md:justify-end">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block">
                {language === 'ur' ? 'Dukan Sahooliyat' : 'Shop Features'}
              </span>
              <ul className="text-xs text-stone-400 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Khaton ka rozana hisab (Daybook)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>One-click WhatsApp Reminders</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Gemini AI Cashflow & Debt Advisor</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block">
                {language === 'ur' ? 'Tahaffuz' : 'Security'}
              </span>
              <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.footerSafeNote}</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  MongoDB Cloud Sync + Real-time local cache
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>{t.footerRights}</p>
          <p className="flex items-center gap-1">
            <span>Dukandaron ke liye pyar se banaya gaya</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
