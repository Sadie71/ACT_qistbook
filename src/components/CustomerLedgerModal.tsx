import React from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Printer, 
  MessageCircle, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Calendar, 
  Clock, 
  BookOpen
} from 'lucide-react';
import { Customer, Transaction, Language, Shopkeeper } from '../types';
import { translations } from '../i18n';

interface CustomerLedgerModalProps {
  customer: Customer;
  transactions: Transaction[];
  shopkeeper: Shopkeeper | null;
  language: Language;
  onClose: () => void;
  onAddTransaction: (customerId: string, defaultType: 'UDHAAR' | 'WASOOLI') => void;
  onDeleteTransaction: (id: string) => void;
  onOpenWhatsApp: (customer: Customer) => void;
}

export const CustomerLedgerModal: React.FC<CustomerLedgerModalProps> = ({
  customer,
  transactions,
  shopkeeper,
  language,
  onClose,
  onAddTransaction,
  onDeleteTransaction,
  onOpenWhatsApp
}) => {
  const t = translations[language];
  const customerTxns = transactions.filter(t => t.customerId === customer.id);
  const hasPending = customer.balance > 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="customer-ledger-modal"
        className="bg-[#fcfaf2] w-full max-w-3xl rounded-2xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-[#2d5a3d] text-amber-50 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-amber-50">
                {customer.name}
              </h2>
              <p className="text-xs text-emerald-100 flex items-center gap-2 font-mono">
                <Phone className="w-3 h-3" />
                {customer.phone || 'No phone'}
                {customer.address && (
                  <>
                    <span>•</span>
                    <span className="font-sans truncate max-w-xs">{customer.address}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title={t.printStatementBtn}
              className="p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-amber-100 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-amber-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ledger Summary Cards */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 grid grid-cols-3 gap-3">
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
            <span className="text-[10px] font-bold text-rose-700 uppercase block">{t.totalCreditTaken}</span>
            <span className="text-sm sm:text-base font-extrabold text-rose-800">
              Rs. {(customer.totalUdhaar || 0).toLocaleString()}
            </span>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">{t.totalPaymentGiven}</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-800">
              Rs. {(customer.totalWasool || 0).toLocaleString()}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${hasPending ? 'bg-amber-50 border-amber-300' : 'bg-stone-50 border-stone-200'}`}>
            <span className="text-[10px] font-bold text-stone-600 uppercase block">{t.currentDues}</span>
            <span className={`text-base sm:text-lg font-black ${hasPending ? 'text-rose-700' : 'text-emerald-700'}`}>
              Rs. {Math.abs(customer.balance).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="px-5 py-3 bg-[#f5f3e8] border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddTransaction(customer.id, 'WASOOLI')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{t.wasooliBtn} (Jama)</span>
            </button>

            <button
              onClick={() => onAddTransaction(customer.id, 'UDHAAR')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{t.udhaarBtn} (Diya)</span>
            </button>
          </div>

          {hasPending && (
            <button
              onClick={() => onOpenWhatsApp(customer)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.reminderBtn}</span>
            </button>
          )}
        </div>

        {/* Transaction History Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <h3 className="font-serif font-bold text-sm text-stone-800 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#2d5a3d]" />
            <span>{t.transactionHistory}</span>
          </h3>

          {customerTxns.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              {t.noTransactions}
            </div>
          ) : (
            <div className="space-y-2.5">
              {customerTxns.map((txn) => {
                const isCredit = txn.type === 'UDHAAR';

                return (
                  <div
                    key={txn.id}
                    className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 flex items-start justify-between gap-3 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        isCredit ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCredit ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isCredit ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {isCredit ? 'Udhaar Diya (Debit)' : 'Wasooli Aai (Credit)'}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {txn.date}
                          </span>
                        </div>

                        {txn.notes && (
                          <p className="text-xs text-stone-700 mt-1 font-medium">
                            {txn.notes}
                          </p>
                        )}
                        {txn.dueDate && (
                          <span className="inline-block text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded mt-1">
                            Wapsi Tareekh: {txn.dueDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`text-sm sm:text-base font-black ${
                          isCredit ? 'text-rose-700' : 'text-emerald-700'
                        }`}>
                          {isCredit ? '+' : '-'} Rs. {txn.amount.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(t.deleteConfirm)) {
                            onDeleteTransaction(txn.id);
                          }
                        }}
                        title="Delete entry"
                        className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-stone-100 text-xs font-semibold transition cursor-pointer"
          >
            {t.cancelBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
