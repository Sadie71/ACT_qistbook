'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  AlertCircle, 
  TrendingUp, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { authFetch } from '@/lib/apiClient';

export default function AdvisorPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Audit state
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [auditError, setAuditError] = useState('');

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Initialize greeting based on active language
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: t('defaultAiGreeting', {
            name: user?.name || (lang === 'en' ? 'Shopkeeper' : 'Dukandar'),
            shopName: user?.shopName || 'QistBook',
          }),
        },
      ]);
    }
  }, [user, lang, t, messages.length]);

  // Run Monthly Audit
  const handleRunAudit = async () => {
    setAuditLoading(true);
    setAuditError('');
    try {
      const res = await authFetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang }),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate audit report.');

      setAuditData(data);
      showToast(t('auditReadySuccess'), 'success');
    } catch (err) {
      setAuditError(err.message);
      showToast(err.message, 'error');
    } finally {
      setAuditLoading(false);
    }
  };

  // Send Chat Message
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await authFetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, lang }),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI Munshi is temporarily busy.');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: t('aiConnError', { msg: err.message }),
          isError: true,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const suggestedQuestions = [
    t('suggestedQ1'),
    t('suggestedQ2'),
    t('suggestedQ3'),
    t('suggestedQ4'),
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-text tracking-tight truncate">
              {t('advisorTitle')}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-soft text-primary uppercase tracking-wider border border-primary/20 shrink-0">
              Gemini AI
            </span>
          </div>
          <p className="text-xs text-muted font-medium mt-0.5 truncate">
            {t('advisorSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAudit}
          disabled={auditLoading}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-heading font-bold text-xs sm:text-sm shadow-glow-primary active:scale-95 transition disabled:opacity-60 cursor-pointer min-h-[44px] self-start sm:self-auto shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${auditLoading ? 'animate-spin' : ''}`} />
          <span>{auditLoading ? t('auditLoading') : t('runAuditBtn')}</span>
        </button>
      </div>

      {/* Monthly Audit Section */}
      {auditError && (
        <div className="p-4 bg-udhaar-soft border border-udhaar/30 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-udhaar">
          <AlertCircle className="w-5 h-5 text-udhaar shrink-0" />
          <div>
            <p className="font-bold">Audit Error</p>
            <p className="text-udhaar/80">{auditError}</p>
          </div>
        </div>
      )}

      {auditData && (
        <div className="bg-surface rounded-3xl border border-primary/30 shadow-fintech-lg p-5 sm:p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">
                  {t('auditResult')}
                </h3>
                <p className="text-xs text-muted">
                  {t('auditRecoveryRateSub', {
                    shopName: auditData.metrics?.shopName,
                    rate: auditData.metrics?.recoveryRate,
                  })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRunAudit}
              className="w-9 h-9 rounded-xl bg-surface-2 border border-border text-muted hover:text-text transition flex items-center justify-center"
              title={t('rerunAuditTooltip')}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Formatted Audit Text */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-border text-xs sm:text-sm text-text whitespace-pre-line leading-relaxed font-sans">
            {auditData.audit}
          </div>
        </div>
      )}

      {/* Interactive AI Munshi Chat Box */}
      <div className="bg-surface rounded-3xl border border-border shadow-fintech-lg flex flex-col h-[560px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-text">
                {t('chatBoxTitle')}
              </h3>
              <p className="text-[11px] text-muted">
                {t('chatBoxSubtitle')}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-wasooli bg-wasooli-soft px-2.5 py-1 rounded-full border border-wasooli/20">
            <span className="w-1.5 h-1.5 rounded-full bg-wasooli animate-pulse" />
            {t('online')}
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] sm:max-w-md p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-primary-dark to-primary text-white rounded-tr-xs shadow-xs'
                      : msg.isError
                      ? 'bg-udhaar-soft text-udhaar border border-udhaar/30 rounded-tl-xs'
                      : 'bg-surface-2 text-text border border-border/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-surface-2 border border-border text-muted flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {chatLoading && (
            <div className="flex items-center gap-2 text-xs text-muted pl-10">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>{t('aiTypingNotice')}</span>
            </div>
          )}
        </div>

        {/* Quick Suggested Questions */}
        <div className="px-4 py-2.5 bg-surface-2 border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar">
          <HelpCircle className="w-4 h-4 text-muted shrink-0" />
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-xs font-semibold text-text bg-surface hover:bg-primary-soft hover:text-primary border border-border px-3 py-1.5 rounded-full whitespace-nowrap transition min-h-[36px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 border-t border-border bg-surface flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('chatPlaceholder')}
            className="flex-1 h-12 px-4 text-xs sm:text-sm rounded-xl bg-surface-2 border border-border focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/40 text-text outline-none transition"
          />
          <button
            type="submit"
            disabled={chatLoading || !inputQuery.trim()}
            className="w-12 h-12 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition disabled:opacity-50 cursor-pointer shrink-0 shadow-xs"
            aria-label={t('sendQuestion')}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
