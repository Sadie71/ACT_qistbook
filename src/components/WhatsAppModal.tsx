import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Copy, ExternalLink, Check, Phone, User, Store } from 'lucide-react';
import { Customer, Language, Shopkeeper } from '../types';
import { translations } from '../i18n';
import { api } from '../lib/api';

interface WhatsAppModalProps {
  customer: Customer;
  shopkeeper: Shopkeeper | null;
  language: Language;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  customer,
  shopkeeper,
  language,
  onClose
}) => {
  const t = translations[language];
  const [message, setMessage] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLink() {
      setLoading(true);
      try {
        const res = await api.getWhatsAppLink({
          customerName: customer.name,
          phone: customer.phone,
          balance: customer.balance,
          shopName: shopkeeper ? shopkeeper.shopName : 'Hamari Dukan',
          language
        });
        setMessage(res.message);
        setLink(res.link);
      } catch {
        const fallbackMsg = language === 'ur'
          ? `Assalam-o-Alaikum ${customer.name} bhai, ${shopkeeper?.shopName || 'Meri Dukan'} se aap ka kul baqi udhaar Rs. ${customer.balance.toLocaleString()} hai. Baraye meherbani jald ada farmayein. Shukriya!`
          : `Dear ${customer.name}, Reminder: your outstanding ledger balance at ${shopkeeper?.shopName || 'our shop'} is Rs. ${customer.balance.toLocaleString()}. Kindly clear at your earliest. Thank you!`;
        setMessage(fallbackMsg);
        let clean = (customer.phone || '').replace(/[^0-9]/g, '');
        if (clean.startsWith('0')) clean = '92' + clean.substring(1);
        setLink(`https://wa.me/${clean}?text=${encodeURIComponent(fallbackMsg)}`);
      } finally {
        setLoading(false);
      }
    }
    loadLink();
  }, [customer, shopkeeper, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="whatsapp-reminder-modal"
        className="bg-[#fcfaf2] w-full max-w-lg rounded-2xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-[#128C7E] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">
                {t.whatsappModalTitle}
              </h2>
              <p className="text-xs text-emerald-100">
                {t.whatsappModalSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer & Balance Info Banner */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-900 block">{customer.name}</span>
            <span className="text-xs text-stone-500 font-mono flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-stone-400" />
              {customer.phone || 'No phone'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-400 font-medium block uppercase">{t.currentDues}</span>
            <span className="text-base font-black text-rose-700">
              Rs. {customer.balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Message Editor / Preview */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
              {t.whatsappMessagePreview}
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                let clean = (customer.phone || '').replace(/[^0-9]/g, '');
                if (clean.startsWith('0')) clean = '92' + clean.substring(1);
                setLink(`https://wa.me/${clean}?text=${encodeURIComponent(e.target.value)}`);
              }}
              className="w-full bg-[#fbf9f1] border border-stone-300 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#128C7E]/40 resize-none font-sans"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
              <span>{copied ? t.messageCopied : t.copyMessageBtn}</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t.openWhatsappBtn}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
