import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Customer, 
  Transaction, 
  AIInsight, 
  Shopkeeper, 
  Language, 
  DbStatusResponse,
  TransactionType
} from './types';
import { api, setStoredToken, getStoredToken } from './lib/api';
import { Navbar } from './components/Navbar';
import { TabNav, TabType } from './components/TabNav';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { CustomerLedgerModal } from './components/CustomerLedgerModal';
import { AiInsightsView } from './components/AiInsightsView';
import { NewTransactionModal } from './components/NewTransactionModal';
import { AuthModal } from './components/AuthModal';
import { AuthGateView } from './components/AuthGateView';
import { WhatsAppModal } from './components/WhatsAppModal';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('ur');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Data States
  const [shopkeeper, setShopkeeper] = useState<Shopkeeper | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  
  // Loading & Error States (fast responsive states)
  const [loading, setLoading] = useState<boolean>(true);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modals
  const [isNewTxnOpen, setIsNewTxnOpen] = useState<boolean>(false);
  const [selectedCustomerIdForTxn, setSelectedCustomerIdForTxn] = useState<string | undefined>(undefined);
  const [defaultTxnType, setDefaultTxnType] = useState<TransactionType>('UDHAAR');
  
  const [selectedCustomerForLedger, setSelectedCustomerForLedger] = useState<Customer | null>(null);
  const [selectedCustomerForWhatsApp, setSelectedCustomerForWhatsApp] = useState<Customer | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Primary Data Loader
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch DB Status
      const dbRes = await api.getDbStatus().catch(() => ({ connected: true, type: 'memory' as const, message: 'Local active' }));
      setDbStatus(dbRes);

      // 2. Check current user authentication
      const token = getStoredToken();
      let currentShopkeeper: Shopkeeper | null = null;

      if (token) {
        try {
          const authRes = await api.getCurrentUser();
          currentShopkeeper = authRes.shopkeeper;
        } catch {
          // Token invalid or expired
          setStoredToken(null);
          currentShopkeeper = null;
        }
      }

      setShopkeeper(currentShopkeeper);

      // 3. If authenticated, fetch shop customers & transactions
      if (currentShopkeeper) {
        const [custRes, txnRes] = await Promise.all([
          api.getCustomers(),
          api.getTransactions()
        ]);

        setCustomers(custRes.customers || []);
        setTransactions(txnRes.transactions || []);

        // 4. Load initial AI insights in background
        api.getAiInsights(language)
          .then(res => setAiInsights(res.insights))
          .catch(err => console.warn('Background AI load notice:', err));
      } else {
        setCustomers([]);
        setTransactions([]);
        setAiInsights(null);
      }

    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setError(err.message || 'Failed to load ledger data.');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handler: Add New Transaction (Credit or Payment)
  const handleSaveTransaction = async (data: {
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
  }) => {
    const res = await api.createTransaction(data);
    
    // Update local state smoothly
    setTransactions(prev => [res.transaction, ...prev]);
    setCustomers(prev => {
      const idx = prev.findIndex(c => c.id === res.customer.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = res.customer;
        return next;
      }
      return [res.customer, ...prev];
    });

    if (selectedCustomerForLedger && selectedCustomerForLedger.id === res.customer.id) {
      setSelectedCustomerForLedger(res.customer);
    }

    if (data.type === 'WASOOLI') {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
      showToast(language === 'ur' ? `Rs. ${data.amount.toLocaleString()} wasooli kamyabi se darj hui!` : `Payment of Rs. ${data.amount.toLocaleString()} recorded!`, 'success');
    } else {
      showToast(language === 'ur' ? `Rs. ${data.amount.toLocaleString()} udhaar khate me darj hua!` : `Credit entry of Rs. ${data.amount.toLocaleString()} saved!`, 'success');
    }

    // If WhatsApp toggle was selected, prompt modal
    if (data.sendWhatsApp && res.customer.balance > 0) {
      setTimeout(() => {
        setSelectedCustomerForWhatsApp(res.customer);
      }, 500);
    }

    // Refresh AI Insights in background
    api.getAiInsights(language).then(aiRes => setAiInsights(aiRes.insights)).catch(() => {});
  };

  // Handler: Delete Customer
  const handleDeleteCustomer = async (id: string) => {
    try {
      await api.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      setTransactions(prev => prev.filter(t => t.customerId !== id));
      if (selectedCustomerForLedger?.id === id) {
        setSelectedCustomerForLedger(null);
      }
      showToast(language === 'ur' ? 'Grahak ka khata khatam kar diya gaya.' : 'Customer account deleted.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Error deleting customer', 'error');
    }
  };

  // Handler: Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      // Refresh customer data
      const custRes = await api.getCustomers();
      setCustomers(custRes.customers);
      if (selectedCustomerForLedger) {
        const updated = custRes.customers.find(c => c.id === selectedCustomerForLedger.id);
        if (updated) setSelectedCustomerForLedger(updated);
      }
      showToast(language === 'ur' ? 'Entry khatam ho gayi.' : 'Entry deleted.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Error deleting transaction', 'error');
    }
  };

  // Handler: Refresh AI Insights
  const handleRefreshAi = async () => {
    setAiLoading(true);
    try {
      const res = await api.getAiInsights(language);
      setAiInsights(res.insights);
      showToast(language === 'ur' ? 'AI Tajziya taza ho gaya!' : 'AI Insights refreshed!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to refresh AI', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Handler: Ask AI Question
  const handleAskAi = async (q: string): Promise<string> => {
    const res = await api.askAiQuestion(q, language);
    return res.answer;
  };

  // Auth Handlers
  const handleLogin = async (data: { phone: string; password: string }) => {
    const res = await api.login(data);
    setStoredToken(res.token);
    setShopkeeper(res.shopkeeper);
    await loadAllData();
    showToast(language === 'ur' ? `Khush Amdeed, ${res.shopkeeper.shopName}!` : `Welcome back, ${res.shopkeeper.shopName}!`, 'success');
  };

  const handleRegister = async (data: { name: string; shopName: string; phone: string; password: string; city?: string }) => {
    const res = await api.register(data);
    setStoredToken(res.token);
    setShopkeeper(res.shopkeeper);
    await loadAllData();
    showToast(language === 'ur' ? `Nayi dukan ${res.shopkeeper.shopName} register ho gayi!` : `Shop ${res.shopkeeper.shopName} registered!`, 'success');
  };

  const handleDemoLogin = async () => {
    try {
      const res = await api.demoLogin();
      setStoredToken(res.token);
      setShopkeeper(res.shopkeeper);
      await loadAllData();
      showToast(language === 'ur' ? 'Demo mode me dakhla kamyab!' : 'Demo mode loaded!', 'info');
    } catch {
      showToast('Failed to enter demo mode', 'error');
    }
  };

  const handleLogout = () => {
    setStoredToken(null);
    setShopkeeper(null);
    setCustomers([]);
    setTransactions([]);
    setAiInsights(null);
    showToast(language === 'ur' ? 'Logout kamyab.' : 'Logged out successfully.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f5f3e8] text-stone-900 flex flex-col font-sans selection:bg-[#2d5a3d]/20 selection:text-[#2d5a3d]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-rose-50 border-rose-700'
              : toastMessage.type === 'info'
              ? 'bg-stone-900 text-stone-100 border-stone-700'
              : 'bg-[#2d5a3d] text-amber-50 border-emerald-600'
          }`}>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        shopkeeper={shopkeeper}
        dbStatus={dbStatus}
        onOpenNewTransaction={() => {
          if (!shopkeeper) {
            setAuthModalMode('login');
            return;
          }
          setSelectedCustomerIdForTxn(undefined);
          setDefaultTxnType('UDHAAR');
          setIsNewTxnOpen(true);
        }}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onLogout={handleLogout}
      />

      {/* Conditional: If not logged in, show Auth Gate (Protected Routes) */}
      {!loading && !shopkeeper ? (
        <main className="flex-1">
          <AuthGateView
            language={language}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onDemoLogin={handleDemoLogin}
          />
        </main>
      ) : (
        <>
          {/* Three Main Tabs Nav */}
          <TabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            language={language}
            customerCount={customers.length}
            hasUrgentRecovery={customers.some(c => c.balance >= 5000)}
          />

          {/* Main View Area */}
          <main className="flex-1">
            {activeTab === 'dashboard' && (
              <DashboardView
                customers={customers}
                transactions={transactions}
                shopkeeper={shopkeeper}
                language={language}
                loading={loading}
                error={error}
                onRetry={loadAllData}
                onOpenNewTransaction={(cId, type) => {
                  setSelectedCustomerIdForTxn(cId);
                  setDefaultTxnType(type || 'UDHAAR');
                  setIsNewTxnOpen(true);
                }}
                onSelectCustomer={(cust) => setSelectedCustomerForLedger(cust)}
                onOpenWhatsApp={(cust) => setSelectedCustomerForWhatsApp(cust)}
                onNavigateToAi={() => setActiveTab('ai')}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersView
                customers={customers}
                shopkeeper={shopkeeper}
                language={language}
                onOpenNewTransaction={(cId, type) => {
                  setSelectedCustomerIdForTxn(cId);
                  setDefaultTxnType(type || 'UDHAAR');
                  setIsNewTxnOpen(true);
                }}
                onSelectCustomer={(cust) => setSelectedCustomerForLedger(cust)}
                onOpenWhatsApp={(cust) => setSelectedCustomerForWhatsApp(cust)}
                onDeleteCustomer={handleDeleteCustomer}
                onAddNewCustomerClick={() => {
                  setSelectedCustomerIdForTxn(undefined);
                  setDefaultTxnType('UDHAAR');
                  setIsNewTxnOpen(true);
                }}
              />
            )}

            {activeTab === 'ai' && (
              <AiInsightsView
                insights={aiInsights}
                shopkeeper={shopkeeper}
                language={language}
                loading={aiLoading}
                onRefresh={handleRefreshAi}
                onAskAi={handleAskAi}
                onOpenWhatsApp={(cust) => setSelectedCustomerForWhatsApp(cust)}
                customers={customers}
              />
            )}
          </main>
        </>
      )}

      {/* Modals */}
      {isNewTxnOpen && (
        <NewTransactionModal
          customers={customers}
          selectedCustomerId={selectedCustomerIdForTxn}
          defaultType={defaultTxnType}
          language={language}
          onClose={() => setIsNewTxnOpen(false)}
          onSubmit={handleSaveTransaction}
        />
      )}

      {selectedCustomerForLedger && (
        <CustomerLedgerModal
          customer={selectedCustomerForLedger}
          transactions={transactions}
          shopkeeper={shopkeeper}
          language={language}
          onClose={() => setSelectedCustomerForLedger(null)}
          onAddTransaction={(cId, type) => {
            setSelectedCustomerIdForTxn(cId);
            setDefaultTxnType(type);
            setIsNewTxnOpen(true);
          }}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenWhatsApp={(cust) => setSelectedCustomerForWhatsApp(cust)}
        />
      )}

      {selectedCustomerForWhatsApp && (
        <WhatsAppModal
          customer={selectedCustomerForWhatsApp}
          shopkeeper={shopkeeper}
          language={language}
          onClose={() => setSelectedCustomerForWhatsApp(null)}
        />
      )}

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          language={language}
          onClose={() => setAuthModalMode(null)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onDemoLogin={handleDemoLogin}
        />
      )}

      {/* Footer */}
      <Footer language={language} />

    </div>
  );
}
