/**
 * Format number into Pakistani currency format: "Rs. 12,500"
 */
export function formatMoney(amount, lang = 'ur') {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString(lang === 'ur' ? 'en-PK' : 'en-US')}`;
}

/**
 * Format standard Date object or string to readable local date
 */
export function formatDate(dateString, lang = 'ur') {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(lang === 'ur' ? 'en-PK' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format datetime for transactions: "15 Aug 2026, 04:30 PM"
 */
export function formatDateTime(dateString, lang = 'ur') {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString(lang === 'ur' ? 'en-PK' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format Pakistani phone numbers to international format (without +):
 * e.g. 03001234567 -> 923001234567
 * e.g. +923001234567 -> 923001234567
 */
export function formatWhatsAppPhone(phone) {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('03')) {
    clean = '92' + clean.substring(1);
  } else if (clean.startsWith('9203')) {
    clean = '92' + clean.substring(3);
  }
  return clean;
}

/**
 * WhatsApp message generator with 3 tones: Friendly, Polite, Firm
 * Supports both English ('en') and Roman Urdu ('ur')
 */
export function generateWhatsAppMessage(tone, { customerName, shopName, balance }, lang = 'ur') {
  const formattedBalance = formatMoney(balance, lang);

  if (lang === 'en') {
    switch (tone) {
      case 'friendly':
        return `Hello ${customerName}! Hope you are doing well. Just a friendly note that your pending credit balance at ${shopName} is ${formattedBalance}. Please settle it whenever convenient. Thank you!`;
      case 'firm':
        return `Dear ${customerName}, your outstanding credit balance of ${formattedBalance} at ${shopName} is overdue. Please settle this payment immediately or contact the shop to keep your ledger account active. Thank you.`;
      case 'polite':
      default:
        return `Dear ${customerName}, this is a gentle reminder from ${shopName} regarding your outstanding credit balance of ${formattedBalance}. Kindly settle the payment at your earliest convenience. Thank you!`;
    }
  }

  switch (tone) {
    case 'friendly':
      return `Salam ${customerName} bhai! Umeed hai aap khairiyat se honge. Aap ki taraf ${shopName} ka kul baqi udhaar ${formattedBalance} banta hai. Jab bhi aasan ho payment kar dijiyega. Shukriya!`;

    case 'firm':
      return `Mohtaram ${customerName} sahib! ${shopName} se aap ka baqi udhaar ${formattedBalance} kafi arsay se wajibul ada hai. Baraye meherbani foran hisab clear karein ya dukan par rabta farmayein taake transactions regular rahein. Shukriya.`;

    case 'polite':
    default:
      return `Assalam-o-Alaikum ${customerName} sahib! Yeh ${shopName} ki taraf se hisab kitab ka ek polite reminder hai. Aap ke khate ka baqi balance ${formattedBalance} hai. Baraye karam aglay chakkar me hisab clear kar dein. JazakAllah!`;
  }
}

/**
 * Pick deterministic non-red/non-green avatar color palette from customer name
 * (Preserves semantic red=owes, green=clear)
 * Returns object that stringifies gracefully to Tailwind classes for backwards-compatibility.
 */
export function getAvatarColor(name = '') {
  const palettes = [
    { bg: 'bg-indigo-100 dark:bg-indigo-950/70', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
    { bg: 'bg-sky-100 dark:bg-sky-950/70', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
    { bg: 'bg-violet-100 dark:bg-violet-950/70', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800' },
    { bg: 'bg-amber-100 dark:bg-amber-950/70', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    { bg: 'bg-teal-100 dark:bg-teal-950/70', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
    { bg: 'bg-cyan-100 dark:bg-cyan-950/70', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
    { bg: 'bg-purple-100 dark:bg-purple-950/70', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % palettes.length;
  const p = palettes[idx];

  return {
    ...p,
    toString: () => `${p.bg} ${p.text}`,
  };
}

export function getInitials(name = '') {
  if (!name) return 'G';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
