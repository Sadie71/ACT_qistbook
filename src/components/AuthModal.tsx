import React, { useState } from 'react';
import { X, Store, User, Lock, Phone, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language, Shopkeeper } from '../types';
import { translations } from '../i18n';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  language: Language;
  onClose: () => void;
  onLogin: (data: { phone: string; password: string }) => Promise<void>;
  onRegister: (data: { name: string; shopName: string; phone: string; password: string; city?: string }) => Promise<void>;
  onDemoLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  language,
  onClose,
  onLogin,
  onRegister,
  onDemoLogin
}) => {
  const t = translations[language];
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin({ phone: phone.trim(), password });
      } else {
        await onRegister({
          name: name.trim(),
          shopName: shopName.trim(),
          phone: phone.trim(),
          password,
          city: city.trim() || undefined
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="auth-modal"
        className="bg-[#fcfaf2] w-full max-w-md rounded-2xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-[#2d5a3d] text-amber-50 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-amber-50">
                {t.authModalTitle}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {mode === 'login' ? t.authModalLoginSub : t.authModalRegisterSub}
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

        {/* Demo Fast Login Banner */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-stone-900">
              {language === 'ur' ? '🚀 Test / Trial Mode' : '🚀 Test Trial Mode'}
            </p>
            <p className="text-[11px] text-stone-600">
              {language === 'ur' ? 'Haji Kiryana Store demo khate me dakhil hon' : 'Instant 1-click access with pre-seeded test data'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onDemoLogin();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 text-xs font-bold transition shadow-xs whitespace-nowrap cursor-pointer"
          >
            Demo Login
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {t.shopNameLabel} *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'ur' ? 'Maslan: Al-Madina Kiryana Store' : 'E.g. City General Store'}
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#2d5a3d]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {t.ownerNameLabel} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'ur' ? 'Maslan: Muhammad Tariq' : 'E.g. Tariq Khan'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#2d5a3d]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {language === 'ur' ? 'Shahr / Elaqa (City)' : 'City / Location'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Rawalpindi, Karachi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#2d5a3d]/30"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              {language === 'ur' ? 'Mobile / WhatsApp Number' : 'Phone Number'} *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 font-mono focus:ring-2 focus:ring-[#2d5a3d]/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              {t.passwordLabel} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#2d5a3d]/30"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-50 font-bold text-xs sm:text-sm shadow-md transition active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{mode === 'login' ? t.loginBtn : t.registerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="text-xs font-semibold text-[#2d5a3d] hover:underline cursor-pointer"
            >
              {mode === 'login' ? t.needAccount : t.haveAccount}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
