import { Language } from './types';

export interface Translations {
  appName: string;
  appBadge: string;
  appTagline: string;
  taglineSub: string;
  
  // Navigation
  tabDashboard: string;
  tabCustomers: string;
  tabAi: string;
  newUdhaarBtn: string;
  registerBtn: string;
  loginBtn: string;
  logoutBtn: string;
  demoShopkeeper: string;
  
  // Metrics
  totalUdhaar: string;
  totalUdhaarSub: string;
  totalWasool: string;
  totalWasoolSub: string;
  activeGrahak: string;
  activeGrahakSub: string;
  recoveryRate: string;
  recoveryRateSub: string;
  
  // Sections
  grahakBalancesTitle: string;
  recentTransactionsTitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterPending: string;
  filterSettled: string;
  allClear: string;
  
  // Customer Table & Card
  grahakName: string;
  phone: string;
  balanceAmount: string;
  lastActive: string;
  actions: string;
  wasooliBtn: string;
  udhaarBtn: string;
  reminderBtn: string;
  viewLedger: string;
  owesYou: string;
  advancePaid: string;
  cleared: string;
  
  // Modals
  nayaUdhaarTitle: string;
  wasooliTitle: string;
  amountLabel: string;
  dateLabel: string;
  itemNotesLabel: string;
  itemNotesPlaceholder: string;
  dueDateLabel: string;
  saveBtn: string;
  cancelBtn: string;
  selectGrahak: string;
  orNewGrahak: string;
  customerNameLabel: string;
  customerPhoneLabel: string;
  sendWhatsAppToggle: string;
  
  // Customer Detail Ledger
  customerLedgerTitle: string;
  customerLedgerSub: string;
  statementSummary: string;
  totalCreditTaken: string;
  totalPaymentGiven: string;
  currentDues: string;
  addEntryBtn: string;
  printStatementBtn: string;
  transactionHistory: string;
  noTransactions: string;
  deleteConfirm: string;
  
  // Mehnay Ka Hisab (AI)
  aiInsightsTitle: string;
  aiInsightsSub: string;
  aiBadge: string;
  refreshAiBtn: string;
  generatingAi: string;
  topDebtorsTitle: string;
  topDebtorsSub: string;
  monthlyTrendTitle: string;
  smartAdviceTitle: string;
  askAiTitle: string;
  askAiPlaceholder: string;
  askAiBtn: string;
  askAiHelper: string;
  daysPending: string;
  
  // Auth
  authModalTitle: string;
  authModalLoginSub: string;
  authModalRegisterSub: string;
  shopNameLabel: string;
  ownerNameLabel: string;
  passwordLabel: string;
  haveAccount: string;
  needAccount: string;
  guestModeBanner: string;
  
  // WhatsApp
  whatsappModalTitle: string;
  whatsappModalSub: string;
  whatsappMessagePreview: string;
  openWhatsappBtn: string;
  copyMessageBtn: string;
  messageCopied: string;
  
  // Status & Errors
  dbConnectedMongo: string;
  dbConnectedLocal: string;
  loadingData: string;
  errorLoading: string;
  retryBtn: string;
  savedSuccess: string;
  deletedSuccess: string;
  
  // Footer
  footerTagline: string;
  footerDescription: string;
  footerSafeNote: string;
  footerRights: string;
}

export const translations: Record<Language, Translations> = {
  ur: {
    appName: 'QistBook',
    appBadge: 'LEDGER + AI',
    appTagline: 'Aap ki dukan ka AI Udhaar Khata',
    taglineSub: 'Rozana ka udhaar, wasooli aur WhatsApp reminders aik jagah',
    
    tabDashboard: 'Dashboard (Khata)',
    tabCustomers: 'Grahak List (Khate)',
    tabAi: 'Mehnay Ka Hisab (AI)',
    newUdhaarBtn: '+ Naya Udhaar',
    registerBtn: 'Register',
    loginBtn: 'Login',
    logoutBtn: 'Logout',
    demoShopkeeper: 'Haji Kiryana Store (Demo)',
    
    totalUdhaar: 'Kul Udhaar (Baqi)',
    totalUdhaarSub: 'Grahakon se lene hain',
    totalWasool: 'Kul Wasooli',
    totalWasoolSub: 'Is mahine jama hue',
    activeGrahak: 'Fa\'al Grahak',
    activeGrahakSub: 'Jin ka khata chal raha hai',
    recoveryRate: 'Wasooli Ki Sharah',
    recoveryRateSub: 'Mahana recovery percentage',
    
    grahakBalancesTitle: 'Grahak Aur Baqi Rakam',
    recentTransactionsTitle: 'Taza Roznamcha (Transactions)',
    searchPlaceholder: 'Grahak ka naam ya phone number dhoondein...',
    filterAll: 'Tamam Khate',
    filterPending: 'Sirf Baqi Wale',
    filterSettled: 'Chukta Khate',
    allClear: 'Koi baqi rakam nahi hai!',
    
    grahakName: 'Grahak Ka Naam',
    phone: 'Phone Number',
    balanceAmount: 'Baqi Rakam',
    lastActive: 'Akhri Transaction',
    actions: 'Amal',
    wasooliBtn: '+ Wasooli',
    udhaarBtn: '+ Udhaar',
    reminderBtn: 'WhatsApp Reminder',
    viewLedger: 'Khata Kholein',
    owesYou: 'Baqi Dena Hai',
    advancePaid: 'Advance Aaya Hua Hai',
    cleared: 'Khata Saf Hai',
    
    nayaUdhaarTitle: 'Naya Udhaar / Wasooli Darj Karein',
    wasooliTitle: 'Grahak Se Wasooli Darj Karein',
    amountLabel: 'Rakam (Rs / PKR)',
    dateLabel: 'Tareekh',
    itemNotesLabel: 'Tafseel / Ashya (Notes)',
    itemNotesPlaceholder: 'Maslan: 10kg Atta, 2kg Cheeni ya Monthly ration...',
    dueDateLabel: 'Wapsi Ki Tareekh (Due Date)',
    saveBtn: 'Khate Me Mehfooz Karein',
    cancelBtn: 'Mansookh',
    selectGrahak: 'Pehle Se Mojood Grahak Chunein',
    orNewGrahak: 'Ya Naye Grahak Ka Naam Likhein',
    customerNameLabel: 'Grahak Ka Naam',
    customerPhoneLabel: 'WhatsApp / Phone Number (e.g. 03001234567)',
    sendWhatsAppToggle: 'Indraj ke baad WhatsApp par notification bheinjein',
    
    customerLedgerTitle: 'Grahak Ka Khata Kitab',
    customerLedgerSub: 'Mukammal udhaar aur wasooli ka hisab kitab',
    statementSummary: 'Khata Khulasa',
    totalCreditTaken: 'Kul Udhaar Liya',
    totalPaymentGiven: 'Kul Wasooli Di',
    currentDues: 'Mojooda Baqi Rakam',
    addEntryBtn: '+ Nayi Entry',
    printStatementBtn: 'Parchi Print Karein',
    transactionHistory: 'Tareekhwar Roznamcha',
    noTransactions: 'Is grahak ki koi transaction record nahi mili.',
    deleteConfirm: 'Kya aap waqai is entry ko khatam karna chahte hain?',
    
    aiInsightsTitle: 'Mehnay Ka Hisab & AI Tajziya',
    aiInsightsSub: 'Gemini AI ki madad se dukan ka cashflow aur udhaar recovery behtar banayein',
    aiBadge: 'GEMINI AI TAJZIYA',
    refreshAiBtn: 'Naya Tajziya Hasil Karein',
    generatingAi: 'AI Tajziya tayyar ho raha hai...',
    topDebtorsTitle: 'Sab Se Zyada Udhaar Wale Grahak',
    topDebtorsSub: 'In grahakon se fori rabta karke wasooli barhayein',
    monthlyTrendTitle: 'Udhaar Banam Wasooli Trend',
    smartAdviceTitle: 'AI Mashwaray & Recovery Tips',
    askAiTitle: 'Dukan Ke Khate Se Mutaliq AI Se Sawal Poochain',
    askAiPlaceholder: 'Maslan: Is mahine ki recovery barhane ke liye kya karoon?',
    askAiBtn: 'Sawal Bheinjein',
    askAiHelper: 'Gemini AI aap ke khate ke data ko scan karke faida mand mashwaray deta hai.',
    daysPending: 'din se baqi',
    
    authModalTitle: 'QistBook Me Dakhla',
    authModalLoginSub: 'Apni dukan ke khate me login karein',
    authModalRegisterSub: 'Nayi dukan ka digital khata register karein',
    shopNameLabel: 'Dukan Ka Naam (Shop Name)',
    ownerNameLabel: 'Dukandar Ka Naam (Owner Name)',
    passwordLabel: 'Password',
    haveAccount: 'Pehle se account hai? Login karein',
    needAccount: 'Naya account banana hai? Register karein',
    guestModeBanner: 'Aap Demo Mode me hain. Data mehfooz karne ke liye Register ya Login karein.',
    
    whatsappModalTitle: 'WhatsApp Reminder Bheinjein',
    whatsappModalSub: 'Grahak ko izzatdar aur wazeh paygham bheinjein',
    whatsappMessagePreview: 'Paygham Ka Preview:',
    openWhatsappBtn: 'WhatsApp Kholein (wa.me)',
    copyMessageBtn: 'Paygham Copy Karein',
    messageCopied: 'Paygham copy ho gaya!',
    
    dbConnectedMongo: 'Cloud Database (MongoDB) Se Rabta Hai',
    dbConnectedLocal: 'Local Fast Storage (Synced)',
    loadingData: 'Dukan ka khata load ho raha hai...',
    errorLoading: 'Khata load karne me rukawat aai. Dobara check karein.',
    retryBtn: 'Dobara Koshish Karein',
    savedSuccess: 'Khate me entry kamyabi se darj ho gayi!',
    deletedSuccess: 'Entry khatam kar di gayi.',
    
    footerTagline: 'QistBook (Credit Ledger + AI) — Your shop\'s credit ledger, now with AI',
    footerDescription: 'Kiryana stores, tandoors, general stores, milk shops aur retail karobar ke liye banaya gaya digital udhaar khata jo rozana ka hisab kitab asaan banata hai aur WhatsApp reminders automate karta hai.',
    footerSafeNote: '100% Mehfooz aur Private. Aap ka data hamesha aap ki dukan ka rehta hai.',
    footerRights: '© 2026 QistBook. All rights reserved. Made for smart shopkeepers.'
  },
  en: {
    appName: 'QistBook',
    appBadge: 'LEDGER + AI',
    appTagline: 'Smart AI Credit Ledger for Your Shop',
    taglineSub: 'Track daily credit, payments, and automated WhatsApp reminders in one place',
    
    tabDashboard: 'Dashboard (Khata)',
    tabCustomers: 'Customers (Khate)',
    tabAi: 'Monthly Analytics (AI)',
    newUdhaarBtn: '+ New Credit Entry',
    registerBtn: 'Register',
    loginBtn: 'Login',
    logoutBtn: 'Logout',
    demoShopkeeper: 'Haji General Store (Demo)',
    
    totalUdhaar: 'Total Outstanding',
    totalUdhaarSub: 'Receivable from customers',
    totalWasool: 'Total Collected',
    totalWasoolSub: 'Recovered this month',
    activeGrahak: 'Active Customers',
    activeGrahakSub: 'Customers with open balance',
    recoveryRate: 'Recovery Rate',
    recoveryRateSub: 'Monthly collection percentage',
    
    grahakBalancesTitle: 'Customer Balances & Receivables',
    recentTransactionsTitle: 'Recent Daybook Entries',
    searchPlaceholder: 'Search customer name or phone number...',
    filterAll: 'All Accounts',
    filterPending: 'Pending Due Only',
    filterSettled: 'Settled Accounts',
    allClear: 'All customer balances are cleared!',
    
    grahakName: 'Customer Name',
    phone: 'Phone Number',
    balanceAmount: 'Balance Due',
    lastActive: 'Last Transaction',
    actions: 'Actions',
    wasooliBtn: '+ Payment',
    udhaarBtn: '+ Credit',
    reminderBtn: 'WhatsApp Reminder',
    viewLedger: 'View Ledger',
    owesYou: 'Owes You',
    advancePaid: 'Advance Paid',
    cleared: 'Cleared',
    
    nayaUdhaarTitle: 'Record Credit / Payment Entry',
    wasooliTitle: 'Record Customer Payment',
    amountLabel: 'Amount (Rs / PKR)',
    dateLabel: 'Date',
    itemNotesLabel: 'Details / Items (Notes)',
    itemNotesPlaceholder: 'E.g. 10kg Flour, 2kg Sugar, monthly ration...',
    dueDateLabel: 'Expected Due Date',
    saveBtn: 'Save to Ledger',
    cancelBtn: 'Cancel',
    selectGrahak: 'Select Existing Customer',
    orNewGrahak: 'Or Enter New Customer Name',
    customerNameLabel: 'Customer Name',
    customerPhoneLabel: 'WhatsApp / Phone Number (e.g. 03001234567)',
    sendWhatsAppToggle: 'Send WhatsApp reminder message immediately after saving',
    
    customerLedgerTitle: 'Customer Ledger Statement',
    customerLedgerSub: 'Complete debit and credit history',
    statementSummary: 'Ledger Summary',
    totalCreditTaken: 'Total Credit Taken',
    totalPaymentGiven: 'Total Payments Received',
    currentDues: 'Current Outstanding Balance',
    addEntryBtn: '+ New Entry',
    printStatementBtn: 'Print Receipt / Statement',
    transactionHistory: 'Transaction History',
    noTransactions: 'No transaction records found for this customer.',
    deleteConfirm: 'Are you sure you want to delete this transaction entry?',
    
    aiInsightsTitle: 'Monthly Insights & AI Analysis',
    aiInsightsSub: 'Optimize shop cashflow and speed up debt recovery with Gemini AI',
    aiBadge: 'GEMINI AI ANALYTICS',
    refreshAiBtn: 'Generate Fresh Analysis',
    generatingAi: 'Generating AI Insights...',
    topDebtorsTitle: 'Top Debtor Accounts',
    topDebtorsSub: 'Prioritize contact with these accounts for maximum cashflow recovery',
    monthlyTrendTitle: 'Credit vs Recovery Trend',
    smartAdviceTitle: 'AI Advice & Actionable Tips',
    askAiTitle: 'Ask AI About Your Shop Ledger & Cashflow',
    askAiPlaceholder: 'E.g. How can I recover pending balances faster this week?',
    askAiBtn: 'Ask AI',
    askAiHelper: 'Gemini AI inspects your ledger metrics to provide tailored business guidance.',
    daysPending: 'days overdue',
    
    authModalTitle: 'Welcome to QistBook',
    authModalLoginSub: 'Log in to your digital shop ledger',
    authModalRegisterSub: 'Register a new shop ledger account',
    shopNameLabel: 'Shop Name (e.g. Super Kiryana Store)',
    ownerNameLabel: 'Shopkeeper / Owner Name',
    passwordLabel: 'Password',
    haveAccount: 'Already have an account? Log in',
    needAccount: 'Need a new account? Register here',
    guestModeBanner: 'You are viewing in Demo Mode. Register or Login to save personal shop records.',
    
    whatsappModalTitle: 'Send WhatsApp Payment Reminder',
    whatsappModalSub: 'Send a polite, professional payment reminder with pre-filled details',
    whatsappMessagePreview: 'Message Preview:',
    openWhatsappBtn: 'Open WhatsApp (wa.me)',
    copyMessageBtn: 'Copy Message Text',
    messageCopied: 'Message copied to clipboard!',
    
    dbConnectedMongo: 'Connected to Cloud Database (MongoDB)',
    dbConnectedLocal: 'Fast Local Storage (Auto-Synced)',
    loadingData: 'Loading shop ledger data...',
    errorLoading: 'Could not load ledger data. Please check connection and retry.',
    retryBtn: 'Retry Now',
    savedSuccess: 'Entry saved to ledger successfully!',
    deletedSuccess: 'Entry deleted successfully.',
    
    footerTagline: 'QistBook (Credit Ledger + AI) — Your shop\'s credit ledger, now with AI',
    footerDescription: 'Built for kiryana stores, tandoors, general stores, milk shops, and retail businesses to easily track daily credit, maintain customer ledgers, and automate WhatsApp payment reminders.',
    footerSafeNote: '100% Private & Secure. Your shop data stays confidential.',
    footerRights: '© 2026 QistBook. All rights reserved. Made for smart shopkeepers.'
  }
};
