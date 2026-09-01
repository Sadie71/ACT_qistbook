import React, { useState } from 'react';
import { 
  Store, 
  User, 
  Lock, 
  Phone, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface AuthGateViewProps {
  language: Language;
  onLogin: (data: { phone: string; password: string }) => Promise<void>;
  onRegister: (data: { name: string; shopName: string; phone: string; password: string; city?: string }) => Promise<void>;
  onDemoLogin: () => void;
}

export const AuthGateView: React.FC<AuthGateViewProps> = ({
  language,
  onLogin,
  onRegister,
  onDemoLogin
}) => {
  const t = translations[language];
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
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
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-gate-view" className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Brand Narrative & Feature Highlights */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2d5a3d] text-amber-50 flex items-center justify-center shadow-lg shadow-[#2d5a3d]/20 ring-2 ring-[#2d5a3d]/20">
              <BookOpen className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="font-serif italic font-extrabold text-3xl tracking-tight text-[#2d5a3d]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  QistBook
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#2d5a3d]/10 text-[#2d5a3d] border border-[#2d5a3d]/30">
                  <Sparkles className="w-2.5 h-2.5 text-[#2d5a3d]" />
                  LEDGER + AI
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                {language === 'ur' ? 'Small Shopkeepers Credit & Udhaar Management' : 'Smart Digital Khata for Small Businesses'}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
              {language === 'ur' 
                ? 'Dukan Ka Khata Mehfooz Aur Digital Banayein' 
                : 'Manage Your Shop Ledger with Confidence & AI'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {language === 'ur'
                ? 'Purani parchi aur khata register se chutkara paiye. QistBook ke sath udhaar aur wasooli ka hisab foran karein, WhatsApp reminder bhejein aur AI tajziya hasil karein.'
                : 'Replace paper registers with a secure digital ledger. Track customer credit & recovery, send 1-click WhatsApp payment reminders, and get automated AI business insights.'}
            </p>
          </div>

          {/* Value Props Pills */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-stone-200/80 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  {language === 'ur' ? '100% Mehfooz Cloud & Local Backup' : '100% Secure Cloud & Local Backup'}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {language === 'ur' ? 'Aap ka tamam data mehfooz rehta hai.' : 'Real-time database sync across all devices.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-stone-200/80 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  {language === 'ur' ? '1-Click WhatsApp Reminders' : '1-Click WhatsApp Reminders'}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {language === 'ur' ? 'Grahak ko foran baqi rakam ka reminder bhejein.' : 'Send pre-filled payment notices directly on WhatsApp.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-stone-200/80 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  {language === 'ur' ? 'AI Se Mahana Hisab Kitab' : 'AI-Powered Business Intelligence'}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {language === 'ur' ? 'Top 5 udhaar lene walon aur monthly trends ka tajziya.' : 'Automated analysis of top debtor accounts and recovery rates.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="md:col-span-6">
          <div className="bg-white rounded-2xl border border-stone-300 shadow-xl overflow-hidden">
            
            {/* Form Top Switcher */}
            <div className="p-2 bg-stone-100 border-b border-stone-200 flex rounded-t-2xl gap-1">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-white text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.loginBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('register');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-white text-stone-950 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.registerBtn}
              </button>
            </div>

            {/* Fast Demo Banner */}
            <div className="p-4 bg-amber-50/80 border-b border-amber-200/70 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-amber-950 block">
                  🚀 {language === 'ur' ? 'Instant Test Drive' : 'Instant 1-Click Test Drive'}
                </span>
                <span className="text-[11px] text-stone-600 block">
                  {language === 'ur' ? 'Haji Kiryana Store demo khate me dakhil hon' : 'Pre-seeded sample ledger with transactions'}
                </span>
              </div>
              <button
                type="button"
                onClick={onDemoLogin}
                className="px-3 py-1.5 rounded-lg bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 text-xs font-bold transition shadow-xs whitespace-nowrap cursor-pointer"
              >
                Demo Login
              </button>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
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
                        className="w-full bg-[#fbf9f1] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
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
                        className="w-full bg-[#fbf9f1] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      {language === 'ur' ? 'Shahr / Market' : 'City / Location'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Lahore, Rawalpindi, Karachi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#fbf9f1] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
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
                    className="w-full bg-[#fbf9f1] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
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
                    className="w-full bg-[#fbf9f1] border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-50 font-bold text-xs sm:text-sm shadow-md transition active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Tasdeeq Ho Rahi Hai...' : mode === 'login' ? t.loginBtn : t.registerBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};
