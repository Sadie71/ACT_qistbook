import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageCircle, 
  FileText, 
  Phone, 
  MapPin, 
  TrendingUp, 
  Trash2, 
  Edit3,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Customer, Language, Shopkeeper } from '../types';
import { translations } from '../i18n';

interface CustomersViewProps {
  customers: Customer[];
  shopkeeper: Shopkeeper | null;
  language: Language;
  onOpenNewTransaction: (customerId?: string, defaultType?: 'UDHAAR' | 'WASOOLI') => void;
  onSelectCustomer: (customer: Customer) => void;
  onOpenWhatsApp: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onAddNewCustomerClick: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  shopkeeper,
  language,
  onOpenNewTransaction,
  onSelectCustomer,
  onOpenWhatsApp,
  onDeleteCustomer,
  onAddNewCustomerClick
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'balance' | 'name' | 'date'>('balance');

  const filteredCustomers = customers
    .filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'balance') return b.balance - a.balance;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.lastTransactionDate || 0).getTime() - new Date(a.lastTransactionDate || 0).getTime();
    });

  return (
    <div id="customers-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Banner */}
      <div className="bg-white/90 rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#2d5a3d]" />
            <span>{t.tabCustomers}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === 'ur' 
              ? 'Dukan ke tamam grahakon ke khate, tafseeli hisab aur wasooli'
              : 'Complete customer accounts, individual ledgers, and transaction history'}
          </p>
        </div>

        <button
          id="add-new-grahak-btn"
          onClick={onAddNewCustomerClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d5a3d] hover:bg-[#234931] text-amber-50 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>{language === 'ur' ? '+ Naya Grahak Shamil Karein' : '+ Add New Customer'}</span>
        </button>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white/80 rounded-xl p-3 sm:p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#fbf9f1] border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-stone-600">
          <span className="font-medium">{language === 'ur' ? 'Tarteeb:' : 'Sort By:'}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#fbf9f1] border border-stone-300 rounded-lg px-2.5 py-1.5 font-semibold text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="balance">{language === 'ur' ? 'Zyada Baqi Rakam' : 'Highest Balance'}</option>
            <option value="date">{language === 'ur' ? 'Taza Tareen Tareekh' : 'Recent Activity'}</option>
            <option value="name">{language === 'ur' ? 'Naam (A-Z)' : 'Customer Name'}</option>
          </select>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white/70 rounded-2xl p-10 text-center border border-dashed border-stone-300">
            <Users className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <h3 className="font-bold text-stone-800 text-sm">{language === 'ur' ? 'Koi grahak nahi mila' : 'No customers found'}</h3>
            <p className="text-xs text-stone-500 mt-1">{language === 'ur' ? 'Naya grahak shamil karne ke liye oopar button dabayein.' : 'Click "+ Add New Customer" to register an account.'}</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const hasPending = customer.balance > 0;

            return (
              <div
                key={customer.id}
                className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-stone-200 hover:border-[#2d5a3d]/50 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 
                        onClick={() => onSelectCustomer(customer)}
                        className="font-bold text-base text-stone-900 hover:text-[#2d5a3d] cursor-pointer transition flex items-center gap-1.5"
                      >
                        {customer.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-mono mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {customer.phone || 'No phone'}
                      </p>
                    </div>

                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      hasPending ? 'bg-rose-100 text-rose-800' : customer.balance < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {hasPending ? t.owesYou : customer.balance < 0 ? t.advancePaid : t.cleared}
                    </span>
                  </div>

                  {customer.address && (
                    <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </p>
                  )}

                  {customer.notes && (
                    <p className="text-[11px] text-stone-600 mt-1.5 bg-[#fbf9f1] p-2 rounded-lg border border-stone-200/60 line-clamp-2">
                      {customer.notes}
                    </p>
                  )}

                  {/* Financial Breakdown */}
                  <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] block uppercase font-medium">{t.totalCreditTaken}</span>
                      <span className="font-bold text-rose-700">Rs. {(customer.totalUdhaar || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-400 text-[10px] block uppercase font-medium">{t.totalPaymentGiven}</span>
                      <span className="font-bold text-emerald-700">Rs. {(customer.totalWasool || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#f5f3e8]/70 border border-[#2d5a3d]/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700">{t.balanceAmount}:</span>
                    <span className={`text-base font-extrabold ${hasPending ? 'text-rose-700' : 'text-emerald-700'}`}>
                      Rs. {Math.abs(customer.balance).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => onSelectCustomer(customer)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-stone-100 hover:bg-[#2d5a3d] text-stone-800 hover:text-white text-xs font-bold transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.viewLedger}</span>
                  </button>

                  <button
                    onClick={() => onOpenNewTransaction(customer.id, 'WASOOLI')}
                    title={t.wasooliBtn}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white transition cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                  </button>

                  {hasPending && (
                    <button
                      onClick={() => onOpenWhatsApp(customer)}
                      title={t.reminderBtn}
                      className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white transition cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(language === 'ur' ? `Kya aap waqai ${customer.name} ka khata delete karna chahte hain?` : `Are you sure you want to delete ${customer.name}'s account?`)) {
                        onDeleteCustomer(customer.id);
                      }
                    }}
                    title="Delete Account"
                    className="p-2 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
