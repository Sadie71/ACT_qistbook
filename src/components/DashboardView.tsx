import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Percent, 
  Search, 
  MessageCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  Phone
} from 'lucide-react';
import { Customer, Transaction, Language, Shopkeeper } from '../types';
import { translations } from '../i18n';

interface DashboardViewProps {
  customers: Customer[];
  transactions: Transaction[];
  shopkeeper: Shopkeeper | null;
  language: Language;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenNewTransaction: (customerId?: string, defaultType?: 'UDHAAR' | 'WASOOLI') => void;
  onSelectCustomer: (customer: Customer) => void;
  onOpenWhatsApp: (customer: Customer) => void;
  onNavigateToAi: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  customers,
  transactions,
  shopkeeper,
  language,
  loading,
  error,
  onRetry,
  onOpenNewTransaction,
  onSelectCustomer,
  onOpenWhatsApp,
  onNavigateToAi
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'settled'>('all');

  // Computed Metrics
  const totalUdhaar = customers.reduce((sum, c) => sum + (c.totalUdhaar || 0), 0);
  const totalWasool = customers.reduce((sum, c) => sum + (c.totalWasool || 0), 0);
  const totalOutstandingBalance = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
  const activeDebtorCount = customers.filter(c => c.balance > 0).length;
  const recoveryRate = totalUdhaar > 0 ? Math.round((totalWasool / totalUdhaar) * 100) : 100;

  // Filtered customer list
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    if (!matchesSearch) return false;
    if (filterType === 'pending') return customer.balance > 0;
    if (filterType === 'settled') return customer.balance <= 0;
    return true;
  });

  // Urgent recovery accounts (overdue or high balance)
  const urgentCustomers = customers.filter(c => c.balance >= 5000);

  if (loading) {
    return (
      <div id="dashboard-loading-state" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50/50 border border-stone-200 rounded-2xl p-8 text-center max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 border-3 border-[#2d5a3d]/20 border-t-[#2d5a3d] rounded-full animate-spin mx-auto mb-4" />
          <h3 className="font-serif font-bold text-lg text-stone-800">{t.loadingData}</h3>
          <p className="text-xs text-stone-500 mt-1">Fetching live ledger entries from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="dashboard-error-state" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-lg mx-auto shadow-xs">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
          <h3 className="font-bold text-stone-900">{t.errorLoading}</h3>
          <p className="text-xs text-rose-700 mt-1 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d5a3d] text-amber-50 text-xs font-semibold hover:bg-[#234931] transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.retryBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* AI Quick Banner */}
      {urgentCustomers.length > 0 && (
        <div className="bg-gradient-to-r from-[#2d5a3d]/10 via-amber-100/60 to-emerald-100/50 border border-[#2d5a3d]/20 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2d5a3d] text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">
                {language === 'ur' 
                  ? `AI Khata Alert: ${urgentCustomers.length} grahakon ke paas Rs. 5,000 se zyada baqi hai.`
                  : `AI Ledger Alert: ${urgentCustomers.length} accounts have pending balance over Rs. 5,000.`}
              </p>
              <p className="text-[11px] text-stone-600">
                {language === 'ur' 
                  ? 'WhatsApp reminders bheinjein taake foran wasooli ho sake.'
                  : 'Send WhatsApp payment reminders now to accelerate your weekly cashflow.'}
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToAi}
            className="text-xs font-bold text-[#2d5a3d] bg-amber-50 hover:bg-white px-3 py-1.5 rounded-lg border border-[#2d5a3d]/30 transition shadow-2xs whitespace-nowrap cursor-pointer"
          >
            {language === 'ur' ? 'AI Tajziya Dekhein →' : 'View AI Insights →'}
          </button>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div id="metrics-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Outstanding Udhaar (Baqi) */}
        <div className="bg-white/80 rounded-xl p-4 border border-rose-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600">{t.totalUdhaar}</span>
            <div className="p-1.5 rounded-md bg-rose-100 text-rose-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-rose-700">
              Rs. {totalOutstandingBalance.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">{t.totalUdhaarSub}</p>
        </div>

        {/* Card 2: Total Wasooli (Collected) */}
        <div className="bg-white/80 rounded-xl p-4 border border-emerald-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600">{t.totalWasool}</span>
            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-800">
              Rs. {totalWasool.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">{t.totalWasoolSub}</p>
        </div>

        {/* Card 3: Active Grahak with Pending Balance */}
        <div className="bg-white/80 rounded-xl p-4 border border-stone-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600">{t.activeGrahak}</span>
            <div className="p-1.5 rounded-md bg-amber-100 text-amber-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {activeDebtorCount}
            </span>
            <span className="text-xs text-stone-500">/ {customers.length} total</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">{t.activeGrahakSub}</p>
        </div>

        {/* Card 4: Recovery Rate % */}
        <div className="bg-white/80 rounded-xl p-4 border border-[#2d5a3d]/20 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600">{t.recoveryRate}</span>
            <div className="p-1.5 rounded-md bg-[#2d5a3d]/10 text-[#2d5a3d]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-[#2d5a3d]">
              {recoveryRate}%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">{t.recoveryRateSub}</p>
        </div>

      </div>

      {/* Main Content Layout: Customer List + Recent Daybook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Grahak Khate List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Header & Search Controls */}
          <div className="bg-white/90 rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                {t.grahakBalancesTitle}
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {filteredCustomers.length} {language === 'ur' ? 'khate mojood hain' : 'records found'}
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#fbf9f1] border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 w-full sm:w-auto shrink-0 overflow-x-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-[#2d5a3d] text-amber-50'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {t.filterAll}
                </button>
                <button
                  onClick={() => setFilterType('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filterType === 'pending'
                      ? 'bg-rose-700 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {t.filterPending}
                </button>
                <button
                  onClick={() => setFilterType('settled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filterType === 'settled'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {t.filterSettled}
                </button>
              </div>
            </div>
          </div>

      {/* Filtered customer list */}
      <div className="space-y-2.5">
        {customers.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-[#2d5a3d] mx-auto flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {language === 'ur' ? 'Abhi koi khata ya udhaar darj nahi hua' : 'No credit or ledger entries recorded yet'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
                {language === 'ur' 
                  ? 'Apni dukan ke grahak ka pehla udhaar ya rozana ki wasooli darj karne ke liye neeche diye gaye button par click karein.'
                  : 'Get started by recording your very first customer credit transaction or cash recovery.'}
              </p>
            </div>
            <button
              onClick={() => onOpenNewTransaction(undefined, 'UDHAAR')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ur' ? '+ Pehla Udhaar Darj Karein' : '+ Add First Credit Entry'}</span>
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white/70 rounded-xl p-8 text-center border border-dashed border-stone-300">
            <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">
              {searchTerm ? (language === 'ur' ? 'Is naam se koi grahak nahi mila' : 'No customer matching search query') : t.allClear}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'ur' ? 'Naya udhaar darj karne ke liye oopar button dabayein.' : 'Click "+ New Credit Entry" above to add customer.'}
            </p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
                const hasPendingBalance = customer.balance > 0;
                const isOverdueAlert = customer.balance >= 10000;

                return (
                  <div
                    key={customer.id}
                    className="group bg-white/90 hover:bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200/90 hover:border-[#2d5a3d]/40 shadow-2xs hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Customer Info & Click to Open Ledger */}
                    <div 
                      onClick={() => onSelectCustomer(customer)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#2d5a3d] transition">
                          {customer.name}
                        </h3>
                        {isOverdueAlert && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                            High Due
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-stone-400" />
                          {customer.phone || 'No phone'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {customer.lastTransactionDate || 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Balance & Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      
                      {/* Balance Display */}
                      <div className="text-left sm:text-right">
                        <span className={`text-base sm:text-lg font-black ${hasPendingBalance ? 'text-rose-700' : 'text-emerald-700'}`}>
                          Rs. {Math.abs(customer.balance).toLocaleString()}
                        </span>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                          {hasPendingBalance ? t.owesYou : customer.balance < 0 ? t.advancePaid : t.cleared}
                        </p>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex items-center gap-1.5">
                        
                        {/* Wasooli Button */}
                        <button
                          onClick={() => onOpenNewTransaction(customer.id, 'WASOOLI')}
                          title={t.wasooliBtn}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 text-xs font-bold transition cursor-pointer"
                        >
                          {t.wasooliBtn}
                        </button>

                        {/* + Udhaar Button */}
                        <button
                          onClick={() => onOpenNewTransaction(customer.id, 'UDHAAR')}
                          title={t.udhaarBtn}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-[#2d5a3d] text-[#2d5a3d] hover:text-amber-50 border border-[#2d5a3d]/30 text-xs font-bold transition cursor-pointer"
                        >
                          {t.udhaarBtn}
                        </button>

                        {/* WhatsApp Reminder Button */}
                        {hasPendingBalance && (
                          <button
                            onClick={() => onOpenWhatsApp(customer)}
                            title={t.reminderBtn}
                            className="p-1.5 rounded-lg bg-emerald-100/70 hover:bg-emerald-600 text-emerald-800 hover:text-white transition cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Open Ledger Arrow */}
                        <button
                          onClick={() => onSelectCustomer(customer)}
                          title={t.viewLedger}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Recent Roznamcha Transactions Feed */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white/90 rounded-xl p-4 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif font-bold text-base text-stone-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2d5a3d]" />
                <span>{t.recentTransactionsTitle}</span>
              </h2>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6">
                  {t.noTransactions}
                </p>
              ) : (
                transactions.slice(0, 10).map((txn) => {
                  const isCredit = txn.type === 'UDHAAR';

                  return (
                    <div
                      key={txn.id}
                      className="p-3 rounded-lg bg-[#fbf9f1] border border-stone-200/80 flex items-start justify-between gap-2 hover:bg-stone-50 transition"
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1.5 rounded-md mt-0.5 shrink-0 ${
                          isCredit ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isCredit ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-stone-900 leading-tight">
                            {txn.customerName}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {txn.notes || (isCredit ? 'Udhaar entry' : 'Wasooli jama')}
                          </p>
                          <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                            {txn.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs sm:text-sm font-extrabold ${
                          isCredit ? 'text-rose-700' : 'text-emerald-700'
                        }`}>
                          {isCredit ? '+ Rs.' : '- Rs.'} {txn.amount.toLocaleString()}
                        </span>
                        <span className={`block text-[9px] uppercase font-bold tracking-wider mt-0.5 ${
                          isCredit ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {isCredit ? 'Udhaar Diya' : 'Wasooli Aai'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
