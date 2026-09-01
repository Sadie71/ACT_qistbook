import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Send, 
  RotateCcw, 
  MessageCircle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { AIInsight, Customer, Language, Shopkeeper } from '../types';
import { translations } from '../i18n';

interface AiInsightsViewProps {
  insights: AIInsight | null;
  shopkeeper: Shopkeeper | null;
  language: Language;
  loading: boolean;
  onRefresh: () => void;
  onAskAi: (question: string) => Promise<string>;
  onOpenWhatsApp: (customer: Customer) => void;
  customers: Customer[];
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({
  insights,
  shopkeeper,
  language,
  loading,
  onRefresh,
  onAskAi,
  onOpenWhatsApp,
  customers
}) => {
  const t = translations[language];
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || asking) return;
    setAsking(true);
    try {
      const ans = await onAskAi(question.trim());
      setAiAnswer(ans);
    } catch {
      setAiAnswer(language === 'ur' ? 'Jawab hasil karne me masla hua. Dobara sawal karein.' : 'Could not retrieve AI answer. Please retry.');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div id="ai-insights-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#2d5a3d] via-[#234931] to-[#152a1c] text-amber-50 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.aiBadge}</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-50">
              {t.aiInsightsTitle}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
              {t.aiInsightsSub}
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? t.generatingAi : t.refreshAiBtn}</span>
          </button>
        </div>

        {/* AI Executive Summary Box */}
        {insights && (
          <div className="relative z-10 mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-amber-50 text-xs sm:text-sm leading-relaxed">
            <p className="font-medium">
              💡 {insights.summary}
            </p>
            <span className="text-[10px] text-amber-200/80 block mt-2">
              Tajziya ka waqt: {insights.generatedAt} • {insights.isAiGenerated ? 'Gemini AI Model Live' : 'Computed Smart Engine'}
            </span>
          </div>
        )}
      </div>

      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols): Top Debtors & Trend Visualizer */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Debtors Box */}
            <div className="bg-white/90 rounded-2xl p-5 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <span>{t.topDebtorsTitle}</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">{t.topDebtorsSub}</p>
                </div>
              </div>

              <div className="space-y-3">
                {insights.topDebtors.length === 0 ? (
                  <div className="text-center py-6 text-xs text-stone-400">
                    {language === 'ur' ? 'Koi baqi udhaar mojood nahi!' : 'No pending debtors!'}
                  </div>
                ) : (
                  insights.topDebtors.map((debtor, index) => {
                    const matchedCustomer = customers.find(c => c.id === debtor.customerId);

                    return (
                      <div
                        key={debtor.customerId}
                        className="p-3.5 rounded-xl bg-[#fbf9f1] border border-stone-200/90 hover:border-rose-300 transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-stone-900">{debtor.customerName}</h4>
                            <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5 font-mono">
                              <span>{debtor.phone}</span>
                              <span>•</span>
                              <span className="text-rose-600 font-sans font-medium">
                                {debtor.pendingDays} {t.daysPending}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-black text-rose-700">
                              Rs. {debtor.amount.toLocaleString()}
                            </span>
                          </div>

                          {matchedCustomer && (
                            <button
                              onClick={() => onOpenWhatsApp(matchedCustomer)}
                              title={t.reminderBtn}
                              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shadow-xs"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Monthly Trend Visualizer (CSS / SVG bar chart) */}
            <div className="bg-white/90 rounded-2xl p-5 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#2d5a3d]" />
                  <span>{t.monthlyTrendTitle}</span>
                </h2>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-rose-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                    Udhaar
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                    Wasooli
                  </span>
                </div>
              </div>

              {/* Responsive Chart Bars */}
              <div className="space-y-4 pt-2">
                {insights.monthlyTrend.map((m) => {
                  const maxVal = Math.max(m.udhaar, m.wasool, 1);
                  const udhaarPct = Math.min(100, Math.round((m.udhaar / (maxVal * 1.2)) * 100));
                  const wasoolPct = Math.min(100, Math.round((m.wasool / (maxVal * 1.2)) * 100));

                  return (
                    <div key={m.month} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-stone-700">
                        <span>{m.month}</span>
                        <div className="space-x-3 text-[11px] font-mono">
                          <span className="text-rose-700">Rs. {m.udhaar.toLocaleString()}</span>
                          <span className="text-emerald-700">Rs. {m.wasool.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Bar comparison */}
                      <div className="space-y-1">
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden flex">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, udhaarPct)}%` }}
                          />
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden flex">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, wasoolPct)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Smart Advice & Ask AI */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Smart Advice Tips */}
            <div className="bg-white/90 rounded-2xl p-5 border border-stone-200 shadow-2xs">
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>{t.smartAdviceTitle}</span>
              </h2>

              <div className="space-y-3">
                {insights.smartAdvice.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs sm:text-sm text-stone-800 leading-relaxed flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2d5a3d] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive "Poochiye AI Se" (Ask AI) */}
            <div className="bg-gradient-to-b from-[#fbf9f1] to-white rounded-2xl p-5 border border-[#2d5a3d]/30 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#2d5a3d] text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {t.askAiTitle}
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                {t.askAiHelper}
              </p>

              <form onSubmit={handleAskSubmit} className="space-y-2.5">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t.askAiPlaceholder}
                  rows={3}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30 resize-none"
                />

                <button
                  type="submit"
                  disabled={asking || !question.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{asking ? 'AI Jawab Soch Raha Hai...' : t.askAiBtn}</span>
                </button>
              </form>

              {aiAnswer && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed animate-in fade-in">
                  <span className="font-bold block text-emerald-900 mb-1">🤖 QistBook AI Jawab:</span>
                  <p>{aiAnswer}</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
