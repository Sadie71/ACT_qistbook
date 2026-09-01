import React from 'react';
import { BookOpen, Plus, Globe, User, LogOut, Sparkles, Database, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Language, Shopkeeper, DbStatusResponse } from '../types';
import { translations } from '../i18n';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  shopkeeper: Shopkeeper | null;
  dbStatus: DbStatusResponse | null;
  onOpenNewTransaction: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  shopkeeper,
  dbStatus,
  onOpenNewTransaction,
  onOpenAuth,
  onLogout
}) => {
  const t = translations[language];

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#f5f3e8]/95 backdrop-blur-md border-b border-[#2d5a3d]/15 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              {/* Green rounded-square icon with book symbol */}
              <div 
                id="brand-logo-icon"
                className="w-10 h-10 rounded-xl bg-[#2d5a3d] text-amber-50 flex items-center justify-center shadow-md shadow-[#2d5a3d]/20 ring-2 ring-[#2d5a3d]/20"
              >
                <BookOpen className="w-5 h-5" strokeWidth={2.2} />
              </div>

              {/* Brand Name & Pill */}
              <div className="flex items-center gap-2">
                <span 
                  id="brand-name"
                  className="font-serif italic font-extrabold text-2xl tracking-tight text-[#2d5a3d] select-none"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  QistBook
                </span>
                <span 
                  id="brand-ai-badge"
                  className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2d5a3d]/10 text-[#2d5a3d] border border-[#2d5a3d]/30"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#2d5a3d]" />
                  LEDGER + AI
                </span>
              </div>
            </div>

            {/* Tagline under logo */}
            <p id="brand-tagline" className="text-xs text-[#2d5a3d]/80 font-medium tracking-tight mt-0.5 flex items-center gap-1.5">
              <span>{t.appTagline}</span>
              {dbStatus && (
                <span className="inline-flex items-center gap-1 text-[10px] text-stone-500 font-normal ml-1 hidden sm:inline-flex">
                  <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.type === 'mongodb' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  {dbStatus.type === 'mongodb' ? 'MongoDB Cloud' : 'Fast Storage'}
                </span>
              )}
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Toggle Dropdown */}
            <div className="relative inline-flex items-center bg-amber-100/60 rounded-lg p-0.5 border border-stone-300/80">
              <Globe className="w-3.5 h-3.5 text-stone-600 ml-2" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Language"
                className="bg-transparent text-xs font-semibold text-stone-800 py-1.5 pl-1.5 pr-2 rounded-md focus:outline-none cursor-pointer"
              >
                <option value="ur">Roman Urdu</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* + Naya Udhaar Button (Green, Filled) */}
            <button
              id="nav-new-udhaar-btn"
              onClick={onOpenNewTransaction}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>{t.newUdhaarBtn}</span>
            </button>

            {/* Auth Buttons */}
            {shopkeeper && shopkeeper.id !== 'demo-shopkeeper-1' ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-stone-900 leading-tight">{shopkeeper.shopName}</span>
                  <span className="text-[11px] text-stone-500">{shopkeeper.name}</span>
                </div>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title={t.logoutBtn}
                  className="p-2 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Register button (outlined) */}
                <button
                  id="nav-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg border border-[#2d5a3d] text-[#2d5a3d] hover:bg-[#2d5a3d]/10 text-xs sm:text-sm font-medium transition cursor-pointer"
                >
                  {t.registerBtn}
                </button>

                {/* Login button (black, filled) */}
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-100 text-xs sm:text-sm font-medium transition shadow-sm cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.loginBtn}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
