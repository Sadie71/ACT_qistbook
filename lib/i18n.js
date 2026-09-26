/**
 * QistBook Central Bilingual i18n Dictionary & Translation Engine
 * Supported Locales: 'ur' (Roman Urdu) and 'en' (English)
 */

export const translations = {
  // ==========================================
  // ROMAN URDU LOCALE (ur)
  // ==========================================
  ur: {
    // Brand & App Meta
    appName: 'QistBook',
    appTagline: 'Dukan Ka Digital Khata & Udhaar Manager',
    metaTitle: 'QistBook — Digital Khata & Udhaar Manager',
    metaDesc: 'Pakistani dukandaron ke liye digital roznamcha, udhaar aur wasooli khata, AI munshi aur WhatsApp reminders.',

    // Common Nav
    home: 'Home',
    dashboard: 'Roznamcha',
    transactions: 'Udhaar & Wasooli',
    customers: 'Grahak List',
    advisor: 'Mahana AI Audit',
    profile: 'Dukan Profile',
    settings: 'Settings & Profile',
    logout: 'Logout',
    login: 'Dakhla (Login)',
    signup: 'Naya Khata (Register)',
    register: 'Naya Khata (Register)',
    save: 'Mehfooz Karein',
    cancel: 'Khatam Karein',
    delete: 'Delete Karein',
    edit: 'Tabdeeli',
    loading: 'Baraye meherbani intezar karein...',
    retry: 'Dobara Koshish',
    search: 'Talash karein...',
    noData: 'Koi record nahi mila',
    total: 'Kul',
    date: 'Tareekh',
    amount: 'Rakam',
    note: 'Tafseel / Item',
    actions: 'Amal',
    status: 'Halat',
    refresh: 'Refresh',
    refreshTooltip: 'Hisab taza karein',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    currency: 'Rs.',
    online: 'Online',
    back: 'Wapis',
    call: 'Call',
    view: 'Dekhein',
    viewAll: 'Sab Dekhein',
    entries: 'Entries',
    optional: 'Ikhtiyari',

    // Nav tabs shorthand for mobile bottom bar
    transactionsNav: 'Khata',
    customersNav: 'Grahak',
    advisorNav: 'AI Hisab',

    // Home Page (Logged-in Hub)
    homeHeroBadge: 'Live Cloud Khata',
    homeWelcome: 'Khush Amdeed, {name}!',
    homeSubtitle: '{shopName} ka mukammal roznamcha, udhaar aur wasooli ka hisab register.',
    homeOpenDashboard: 'Roznamcha Dashboard Kholein',
    homeViewCustomers: 'Grahak List',
    homeCardDashboardDesc: 'Aaj ka udhaar, wasooli, kul baqi rakam aur pichlay 7 din ka karobari tajziya.',
    homeCardDashboardLink: 'Dashboard Par Jayein',
    homeCardTransactionsDesc: 'Naya udhaar dein, wasooli darj karein aur tareekh ke mutabiq roznamcha filter karein.',
    homeCardTransactionsLink: 'Roznamcha Kholein',
    homeCardCustomersDesc: 'Grahakon ka khata, shakhsi balance, statement download aur WhatsApp reminder.',
    homeCardCustomersLink: 'Grahak List Dekhein',
    homeCardAdvisorDesc: 'Gemini AI ke zariye dukan ki wasooli ka tajziya aur smart hisab kitab mashware.',
    homeCardAdvisorLink: 'AI Munshi Se Poochhein',
    homeCardProfileDesc: 'Dukan ka naam, owner ki maloomaat, password tabdeeli aur security settings.',
    homeCardProfileLink: 'Profile Settings',
    homeCardShopInfo: 'Dukan Maloomaat',
    homeShopLabel: 'Dukan',
    homeEmailLabel: 'Email',
    homeGoToDashboard: 'Dashboard Par Jayein',

    // Public Landing Page
    landingBadge: 'Pakistan Ka #1 Digital Khata & Udhaar Manager',
    landingHeadline: 'Dukan Ka Udhaar aur Wasooli Ab Ungliyon Par',
    landingSubheadline: 'Purani diary aur kagazi khate ki ghaltiyon se nijaat payein. Mukammal mehfooz cloud khata, automated WhatsApp reminders aur AI Munshi audit.',
    landingCtaRegister: 'Naya Khata Kholein (Register)',
    landingCtaLogin: 'Dukan Login Karein',
    landingDemoNotice: '✨ 1-Click Demo Login dastyaab hai — baghair registration ke foran check karein.',
    landingFeatureTitle: 'Kamyab Dukandaron Ki Pehli Pasand',
    landingFeatureSubtitle: 'Kiryana, General Store, Hardware, Tailor aur har chote bare karobar ke liye banaya gaya',
    featLedgerTitle: 'Roznamcha Khata',
    featLedgerDesc: 'Har grahak ka alag khata, automatic balance calculations aur 0% hisab ghalti.',
    featWhatsappTitle: 'WhatsApp Reminders',
    featWhatsappDesc: '1-click me ba-adab aur dostana WhatsApp reminder bhejein aur udhaar foran wasool karein.',
    featAiTitle: 'AI Munshi Advisor',
    featAiDesc: 'Gemini AI se dukan ki wasooli ka tajziya karwayein aur munafa barhane ke mashware lein.',
    featCloudTitle: 'Mehfooz Cloud',
    featCloudDesc: 'MongoDB Atlas par cloud backup — mobile kharab ya ghum ho jaye, hisab hamesha mehfooz.',
    copyright: '© {year} QistBook Digital Khata. All rights reserved.',

    // Dashboard Header & Stats
    ledger: 'Roznamcha',
    welcomeUser: 'Khush Amdeed, {name}!',
    shopSubtitle: '{shopName} • Digital Roznamcha & Wasooli Khata',
    loadErrorTitle: 'Hisab Load Nahi Ho Saka',
    totalOutstanding: 'Kul Baqi Udhaar',
    totalCreditStuck: 'Market me phansa kul udhaar',
    todayUdhaar: 'Aaj Ka Udhaar',
    todayWasooli: 'Aaj Ki Wasooli',
    todayCashIn: 'Aaj ki naqd wasooli (Cash in)',
    activeCustomersRecovery: 'Active Grahak & Recovery',
    recoveredPercentage: '{n}% Wasooli',
    monthRecovery: 'Is Mahine Ki Wasooli',
    collectionRate: 'Wasooli Ki Sharah',

    // Dashboard Actions
    btnCreditGiven: '+ Udhaar Diya',
    btnPaymentReceived: '+ Wasooli Mili',

    // Dashboard 7-Day Chart
    last7Days: 'Pichlay 7 Din Ka Roznamcha',
    last7DaysComparison: 'Rozana udhaar vs naqd wasooli ka taqabul',
    credit: 'Udhaar',
    recovery: 'Wasooli',

    // Dashboard AI Callout Card
    aiCardTitle: 'AI Munshi Se Mahana Mashwara Lein',
    aiCardDesc: 'Audit report banwayein aur wasooli tez karein',
    aiCardBtn: 'Mashwara Dekhein',

    // Dashboard Top Debtors
    topDebtors: 'Sab Se Zyada Udhaar Wale Grahak',
    whatsappQuickRecovery: 'Fauran wasooli ke liye WhatsApp karein',
    allClear: 'Tamam Khata Saaf Hai!',
    noPendingCredit: 'Abhi koi baqi udhaar nahi hai.',
    addFirstCustomer: '+ Naya Grahak Add Karein',
    viewAllCustomers: 'Tamam {total} Grahak List Kholein',
    sendWhatsappReminder: 'WhatsApp Reminder Bhejein',

    // Dashboard Recent Transactions
    recentTransactions: 'Taaza Tareen Entries',
    recentTransactionsSub: 'Pichli 5 darj shuda transactions',
    fullHistory: 'Mukammal History',
    noTxnYet: 'Abhi tak koi entry darj nahi hui',
    noTxnYetSub: 'Naya udhaar ya wasooli darj karne ke liye upar wale button dabayein.',
    recordFirstEntry: 'Pehla Indraj Karein',
    creditKhata: 'Udhaar Khata',
    cashRecovery: 'Wasooli',

    // Transactions page
    transactionsSubtitle: 'Tamam udhaar aur wasooli ka mukammal roznamcha register',
    recordTransaction: 'Nayi Entry Darj Karein',
    selectCustomer: 'Grahak Muntakhib Karein',
    selectOrCreate: 'Grahak talash karein...',
    transactionType: 'Kism',
    typeUdhaar: 'Udhaar Diya (Credit)',
    typeWasooli: 'Wasooli Mili (Payment)',
    enterAmount: 'Rakam likhein (e.g. 1500)',
    notePlaceholder: 'Maslan: Aata, cheeni, doodh ya cash wasooli',
    filterAll: 'Tamam Entries',
    filterUdhaar: 'Sirf Udhaar',
    filterWasooli: 'Sirf Wasooli',
    balanceAfter: 'Baqi Khata',
    totalUdhaarSummary: 'Total Udhaar',
    totalWasooliSummary: 'Total Wasooli',
    netDifference: 'Net (Wasooli - Udhaar)',
    dateFilterLabel: 'Tareekh:',
    presetToday: 'Aaj (Today)',
    presetWeek: 'Yeh Hafta',
    presetMonth: 'Yeh Maheena',
    presetAll: 'Hamesha (All Time)',
    searchTxnPlaceholder: 'Grahak ya note talash karein...',
    allCustomersDropdown: 'Tamam Grahak ({total})',
    noTransactionsFound: 'Upar diye gaye buttons se naya udhaar ya wasooli darj karein ya filters tabdeel karein.',

    // Customers page
    customerListTitle: 'Tamam Grahakon Ka Khata',
    customerCountSubtitle: 'Kul {count} grahak • Baqi udhaar: {balance}',
    addNewCustomer: '+ Naya Grahak',
    customerName: 'Grahak Ka Naam',
    customerPhone: 'Mobile / WhatsApp Number',
    customerAddress: 'Pata / Muhalla',
    customerNotes: 'Khas Note (Zamidar, Dukan, etc.)',
    initialBalanceLabel: 'Pichla Baqi Udhaar (Agar pehle se koi udhaar ho to Rs.)',
    allCleared: 'Sab Hisab Saf Hai (Rs. 0)',
    owesMoney: 'Baqi Udhaar',
    clearedBadge: 'Chukta',
    advanceBadge: 'Advance',
    viewLedger: 'Khata Kholein',
    sendReminder: 'WhatsApp Reminder',
    noCustomersYet: 'Abhi koi grahak nahi, pehla grahak add karein!',
    noCustomerFoundSearch: 'Koi grahak nahi mila',
    noCustomerSearchSub: 'Talash ka lafz tabdeel karein ya naya grahak shamil karein.',
    noCustomerEmptySub: 'Naye grahak ka khata shuru karne ke liye neeche click karein.',
    searchCustomerPlaceholder: 'Grahak ka naam, phone number ya mohalla...',
    filterAllCustomers: 'Sab ({count})',
    filterDebtors: 'Udhaar ({count})',
    filterClear: 'Chukta ({count})',
    deleteConfirmCust: 'Kya aap waqai is grahak aur is ka tamam record delete karna chahte hain?',
    deleteCustWarning: '{name} ka khata aur tamam transactions mukammal tor par delete ho jayenge.',
    customerAddedSuccess: '{name} kamyabi se shamil ho gaya!',
    customerDeletedSuccess: 'Grahak aur hisab delete ho gaya.',
    namePhoneRequired: 'Naam aur phone number zaroori hain.',

    // Individual Customer Ledger page
    ledgerTitle: 'Khata Register',
    runningBalance: 'Baqi Balance',
    printLedger: 'Print Khata',
    exportCsv: 'Export CSV',
    totalGiven: 'Kul Diya Gaya Udhaar',
    totalReceived: 'Kul Wasool Rakam',
    totalGoodsGivenSub: 'Kul diya gaya samaan',
    totalPaymentReceivedSub: 'Kul wasool payment',
    specialNote: 'Khas Note:',
    emptyCustomerLedger: 'Abhi is grahak ka koi khata entry darj nahi hai.',
    entryDeleted: 'Entry delete ho gayi',
    deleteConfirmTxn: 'Kya aap is transaction ko delete karna chahte hain?',
    deleteTxnWarning: 'Yeh transaction delete ho jayegi aur running balance dobara calculate kiya jayega.',
    editCustomerTitle: 'Grahak Ki Maloomaat Tabdeel Karein',
    customerUpdatedSuccess: 'Grahak ki maloomaat update ho gayi!',
    customerNotFound: 'Grahak nahi mila',
    backToCustomerList: 'Wapis Grahak List',
    printDukandarInfo: 'Dukandar: {name} • QistBook Digital Khata',
    printDate: 'Tareekh:',

    // WhatsApp Modal
    whatsappModalTitle: 'WhatsApp Payment Reminder',
    reminderTone: 'Message Ka Lehja (Tone)',
    toneFriendly: 'Dostana (Friendly)',
    tonePolite: 'Shayasta (Polite)',
    toneFirm: 'Sakht (Firm)',
    previewMessage: 'Message Ka Jaiza',
    sendOnWhatsApp: 'WhatsApp Par Bhejein',
    editableTextNotice: 'Edit kar sakte hain',
    editableNotice: 'Edit kar sakte hain',
    invalidPhoneError: 'Grahak ka valid phone number nahi mila.',
    noValidPhone: 'Grahak ka valid phone number nahi mila.',

    // Quick Transaction Modal
    addCustomerInlineTitle: '+ Naya Grahak Add Karein',
    pleaseAddCustomerFirst: 'Pehle grahak add karein!',
    saveCustomerBtn: '+ Grahak Save Karein',
    creditGivenSuccess: 'Udhaar darj ho gaya!',
    paymentReceivedSuccess: 'Wasooli darj ho gayi!',
    selectCustomerError: 'Baraye meherbani grahak muntakhib karein.',
    selectCustomerRequired: 'Baraye meherbani grahak muntakhib karein.',
    enterValidAmountError: 'Sahih rakam darj karein.',
    validAmountRequired: 'Sahih rakam darj karein.',
    customerNamePlaceholder: 'Grahak Ka Naam (e.g. Aslam Tailor)',
    customerPhonePlaceholder: 'Mobile / WhatsApp (03001234567)',
    amountLabelPKR: 'Rakam (Pakistani Rupee)',

    // Advisor / AI page
    advisorTitle: 'AI Munshi & Mahana Hisab',
    advisorSubtitle: 'Dukan ki maaliyat aur wasooli ka automated tajziya',
    runAuditBtn: 'Mahana AI Audit Karein',
    auditLoading: 'AI dukan ke khate ka tajziya kar raha hai...',
    auditResult: 'Mahana Audit Report',
    auditReadySuccess: 'Mahana AI Audit Report tayyar hai!',
    auditRecoveryRateSub: '{shopName} • Wasooli Ki Sharah: {rate}%',
    rerunAuditTooltip: 'Dobara Audit Karein',
    chatBoxTitle: 'AI Munshi Se Baat Karein',
    chatBoxSubtitle: 'Roman Urdu me sawal poochhein',
    chatPlaceholder: 'Poochhein: "Kis se sab se ziada wasooli baqi hai?"',
    sendQuestion: 'Bhejein',
    aiTypingNotice: 'AI Munshi jawab likh raha hai...',
    aiConnError: 'Maaf kijiye, rabta nahi ho saka: {msg}. Baraye meherbani thori der baad koshish karein.',
    suggestedQ1: 'Kin grahakon se pehle paise lene chahiyein?',
    suggestedQ2: 'Kis se sab se ziada wasooli baqi hai?',
    suggestedQ3: 'Meri wasooli ki sharah kaisi hai?',
    suggestedQ4: 'Udhaar kam karne ka tareeqa batayein.',
    defaultAiGreeting: 'Assalam-o-Alaikum {name} sahib! Main aap ki dukan "{shopName}" ka AI Munshi hoon. Aap مجھ se dukan ke udhaar, baqi wasooli ya kisi bhi grahak ke hisab ke baray me sawal pooch sakte hain!',

    // Settings / Profile page
    settingsTitle: 'Dukan Ki Maloomaat & Settings',
    settingsSubtitle: 'Apni dukan ki maloomaat aur password tabdeel karein',
    shopNameLabel: 'Dukan Ka Naam',
    shopTypeLabel: 'Dukan Ki Kism',
    ownerNameLabel: 'Dukandar Ka Naam',
    emailLabel: 'Email Address',
    changePassword: 'Password Tabdeel Karein',
    newPasswordLabel: 'Naya Password',
    confirmPasswordLabel: 'Naye Password Ki Tasdeeq',
    newPasswordPlaceholder: 'Kam az kam 6 characters',
    confirmPasswordPlaceholder: 'Dobara naya password likhein',
    saveChanges: 'Tabdeeli Mehfooz Karein',
    profileSavedSuccess: 'Profile kamyabi se save ho gayi!',
    passwordMismatch: 'Naya password aur confirm password match nahi ho rahe.',
    passwordLengthError: 'Password kam az kam 6 characters ka hona chahiye.',
    logoutCardTitle: 'Account Se Khurooj',
    logoutCardSubtitle: 'Is device par session khatam karein',

    // Auth (Login / Register)
    loginTitle: 'QistBook Me Dakhla',
    loginSubtitle: 'Apna email aur password darj karein',
    signupTitle: 'Nayi Dukan Register Karein',
    alreadyHaveAccount: 'Pehle se account hai?',
    dontHaveAccount: 'Naya khata banana hai?',
    passwordLabel: 'Password',
    demoLoginBtn: '1-Click Demo Login (Haji Kiryana Store)',
    demoStoreName: 'Haji Kiryana & General Store',
  },

  // ==========================================
  // ENGLISH LOCALE (en)
  // ==========================================
  en: {
    // Brand & App Meta
    appName: 'QistBook',
    appTagline: 'Digital Khata & Credit Ledger for Retail Stores',
    metaTitle: 'QistBook — Digital Credit Ledger & Khata Book',
    metaDesc: 'Digital credit ledger, debt recovery manager, AI audit, and WhatsApp reminders for retail shopkeepers.',

    // Common Nav
    home: 'Home',
    dashboard: 'Dashboard',
    transactions: 'Credit & Recovery',
    customers: 'Customers',
    advisor: 'Monthly AI Audit',
    profile: 'Profile',
    settings: 'Settings & Profile',
    logout: 'Logout',
    login: 'Login',
    signup: 'Register Shop',
    register: 'Register Shop',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Please wait...',
    retry: 'Retry',
    search: 'Search...',
    noData: 'No records found',
    total: 'Total',
    date: 'Date',
    amount: 'Amount',
    note: 'Description / Item',
    actions: 'Actions',
    status: 'Status',
    refresh: 'Refresh',
    refreshTooltip: 'Refresh ledger data',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    currency: 'Rs.',
    online: 'Online',
    back: 'Back',
    call: 'Call',
    view: 'View',
    viewAll: 'View All',
    entries: 'Entries',
    optional: 'Optional',

    // Nav tabs shorthand for mobile bottom bar
    transactionsNav: 'Ledger',
    customersNav: 'Customers',
    advisorNav: 'AI Audit',

    // Home Page (Logged-in Hub)
    homeHeroBadge: 'Live Cloud Ledger',
    homeWelcome: 'Welcome, {name}!',
    homeSubtitle: 'Complete daily ledger, credit and recovery record for {shopName}.',
    homeOpenDashboard: 'Open Daily Ledger Dashboard',
    homeViewCustomers: 'View Customers',
    homeCardDashboardDesc: "Today's credit, recovery, total outstanding balance, and 7-day business analytics.",
    homeCardDashboardLink: 'Go to Dashboard',
    homeCardTransactionsDesc: 'Issue credit, record payments, and filter daily ledger records by date.',
    homeCardTransactionsLink: 'Open Ledger',
    homeCardCustomersDesc: 'Customer accounts, personal balances, statement downloads, and WhatsApp reminders.',
    homeCardCustomersLink: 'View Customer List',
    homeCardAdvisorDesc: 'AI-powered recovery insights, financial audits, and retail business recommendations.',
    homeCardAdvisorLink: 'Ask AI Advisor',
    homeCardProfileDesc: 'Store details, owner information, password changes, and security settings.',
    homeCardProfileLink: 'Profile Settings',
    homeCardShopInfo: 'Store Information',
    homeShopLabel: 'Store',
    homeEmailLabel: 'Email',
    homeGoToDashboard: 'Go to Dashboard',

    // Public Landing Page
    landingBadge: "Pakistan's #1 Digital Ledger & Credit Manager",
    landingHeadline: 'Store Credit and Recovery at Your Fingertips',
    landingSubheadline: 'Eliminate manual ledger errors and lost diaries. Secure cloud khata, automated WhatsApp payment reminders, and AI-driven business audits.',
    landingCtaRegister: 'Create Store Account (Register)',
    landingCtaLogin: 'Shopkeeper Login',
    landingDemoNotice: '✨ 1-Click Demo Login available — test instantly without registration.',
    landingFeatureTitle: 'Trusted by Successful Retail Merchants',
    landingFeatureSubtitle: 'Designed for grocery, general stores, hardware, apparel, and retail shops of all sizes.',
    featLedgerTitle: 'Daily Ledger Book',
    featLedgerDesc: 'Individual customer accounts, automated balance calculation, and 0% calculation errors.',
    featWhatsappTitle: 'WhatsApp Reminders',
    featWhatsappDesc: 'Send polite and professional payment reminders in 1-click to accelerate debt recovery.',
    featAiTitle: 'AI Financial Advisor',
    featAiDesc: 'Analyze collection rates and get actionable business recommendations with Gemini AI.',
    featCloudTitle: 'Secure Cloud Backup',
    featCloudDesc: 'Backed up in real-time on MongoDB Atlas — your ledger is safe even if your phone is lost.',
    copyright: '© {year} QistBook Digital Khata. All rights reserved.',

    // Dashboard Header & Stats
    ledger: 'Ledger',
    welcomeUser: 'Welcome, {name}!',
    shopSubtitle: '{shopName} • Digital Ledger & Recovery Book',
    loadErrorTitle: 'Unable to Load Ledger',
    totalOutstanding: 'Total Outstanding Credit',
    totalCreditStuck: 'Total credit stuck in the market',
    todayUdhaar: "Today's Credit Given",
    todayWasooli: "Today's Cash Recovered",
    todayCashIn: "Today's cash collected (Cash in)",
    activeCustomersRecovery: 'Active Customers & Recovery',
    recoveredPercentage: '{n}% Recovered',
    monthRecovery: "This Month's Recovery",
    collectionRate: 'Collection Rate',

    // Dashboard Actions
    btnCreditGiven: '+ Credit Given',
    btnPaymentReceived: '+ Payment Received',

    // Dashboard 7-Day Chart
    last7Days: 'Last 7 Days Ledger Activity',
    last7DaysComparison: 'Daily credit vs cash recovery comparison',
    credit: 'Credit',
    recovery: 'Recovery',

    // Dashboard AI Callout Card
    aiCardTitle: 'Get Monthly Guidance from AI Munshi',
    aiCardDesc: 'Generate an audit report and speed up recovery',
    aiCardBtn: 'View Advice',

    // Dashboard Top Debtors
    topDebtors: 'Top Debtors',
    whatsappQuickRecovery: 'WhatsApp them for quick recovery',
    allClear: 'All Accounts are Clear!',
    noPendingCredit: 'There is currently no outstanding credit.',
    addFirstCustomer: '+ Add New Customer',
    viewAllCustomers: 'Open All {total} Customers',
    sendWhatsappReminder: 'Send WhatsApp Reminder',

    // Dashboard Recent Transactions
    recentTransactions: 'Recent Transactions',
    recentTransactionsSub: 'Last 5 recorded transactions',
    fullHistory: 'Full History',
    noTxnYet: 'No transactions recorded yet',
    noTxnYetSub: 'Use the buttons above to record credit given or payment received.',
    recordFirstEntry: 'Record First Entry',
    creditKhata: 'Credit Ledger',
    cashRecovery: 'Payment',

    // Transactions page
    transactionsSubtitle: 'Complete daily ledger register for all credit given and payments collected',
    recordTransaction: 'Record New Transaction',
    selectCustomer: 'Select Customer',
    selectOrCreate: 'Search or select customer...',
    transactionType: 'Type',
    typeUdhaar: 'Credit Given (Udhaar)',
    typeWasooli: 'Payment Received (Wasooli)',
    enterAmount: 'Enter amount (e.g. 1500)',
    notePlaceholder: 'e.g. Monthly groceries, flour, sugar, or cash settlement',
    filterAll: 'All Entries',
    filterUdhaar: 'Credit Only',
    filterWasooli: 'Recovery Only',
    balanceAfter: 'Balance After',
    totalUdhaarSummary: 'Total Credit',
    totalWasooliSummary: 'Total Recovery',
    netDifference: 'Net (Recovery - Credit)',
    dateFilterLabel: 'Date:',
    presetToday: 'Today',
    presetWeek: 'This Week',
    presetMonth: 'This Month',
    presetAll: 'All Time',
    searchTxnPlaceholder: 'Search by customer name or item note...',
    allCustomersDropdown: 'All Customers ({total})',
    noTransactionsFound: 'Use the buttons above to record a new transaction or modify your search filters.',

    // Customers page
    customerListTitle: 'Customer Accounts',
    customerCountSubtitle: 'Total {count} customers • Outstanding balance: {balance}',
    addNewCustomer: '+ Add Customer',
    customerName: 'Customer Name',
    customerPhone: 'Mobile / WhatsApp Number',
    customerAddress: 'Address / Street',
    customerNotes: 'Customer Notes (e.g. monthly buyer)',
    initialBalanceLabel: 'Previous Outstanding Balance (if any initial credit exists, in Rs.)',
    allCleared: 'All Clear (Rs. 0)',
    owesMoney: 'Pending Balance',
    clearedBadge: 'Cleared',
    advanceBadge: 'Advance',
    viewLedger: 'View Ledger',
    sendReminder: 'WhatsApp Reminder',
    noCustomersYet: 'No customers yet, add your first customer to get started!',
    noCustomerFoundSearch: 'No customer found',
    noCustomerSearchSub: 'Change your search keyword or add a new customer.',
    noCustomerEmptySub: 'Click below to start a new customer ledger.',
    searchCustomerPlaceholder: 'Customer name, phone number or neighborhood...',
    filterAllCustomers: 'All ({count})',
    filterDebtors: 'Credit ({count})',
    filterClear: 'Clear ({count})',
    deleteConfirmCust: 'Are you sure you want to delete this customer and all their transaction history?',
    deleteCustWarning: 'The ledger for {name} and all associated entries will be permanently removed.',
    customerAddedSuccess: '{name} added successfully!',
    customerDeletedSuccess: 'Customer account and ledger deleted.',
    namePhoneRequired: 'Customer name and phone number are required.',

    // Individual Customer Ledger page
    ledgerTitle: 'Customer Ledger Statement',
    runningBalance: 'Running Balance',
    printLedger: 'Print Ledger',
    exportCsv: 'Export CSV',
    totalGiven: 'Total Credit Given',
    totalReceived: 'Total Recovered',
    totalGoodsGivenSub: 'Total goods sold on credit',
    totalPaymentReceivedSub: 'Total payments collected',
    specialNote: 'Special Note:',
    emptyCustomerLedger: 'No ledger entries recorded for this customer yet.',
    entryDeleted: 'Entry deleted successfully',
    deleteConfirmTxn: 'Are you sure you want to delete this transaction entry?',
    deleteTxnWarning: 'This transaction will be deleted and the running balance recalculated.',
    editCustomerTitle: 'Edit Customer Information',
    customerUpdatedSuccess: 'Customer information updated successfully!',
    customerNotFound: 'Customer not found',
    backToCustomerList: 'Back to Customer List',
    printDukandarInfo: 'Shopkeeper: {name} • QistBook Digital Khata',
    printDate: 'Date:',

    // WhatsApp Modal
    whatsappModalTitle: 'WhatsApp Payment Reminder',
    reminderTone: 'Message Tone',
    toneFriendly: 'Friendly',
    tonePolite: 'Polite',
    toneFirm: 'Firm',
    previewMessage: 'Message Preview',
    sendOnWhatsApp: 'Send on WhatsApp',
    editableTextNotice: 'Editable text',
    editableNotice: 'Editable text',
    invalidPhoneError: 'No valid phone number found for customer.',
    noValidPhone: 'No valid phone number found for customer.',

    // Quick Transaction Modal
    addCustomerInlineTitle: '+ Add New Customer',
    pleaseAddCustomerFirst: 'Please add a customer first!',
    saveCustomerBtn: '+ Save Customer',
    creditGivenSuccess: 'Credit given recorded successfully!',
    paymentReceivedSuccess: 'Payment received recorded successfully!',
    selectCustomerError: 'Please select a customer.',
    selectCustomerRequired: 'Please select a customer.',
    enterValidAmountError: 'Please enter a valid amount.',
    validAmountRequired: 'Please enter a valid amount.',
    customerNamePlaceholder: 'Customer Name (e.g. Aslam Tailor)',
    customerPhonePlaceholder: 'Mobile / WhatsApp (03001234567)',
    amountLabelPKR: 'Amount (Pakistani Rupee)',

    // Advisor / AI page
    advisorTitle: 'AI Financial Advisor & Audit',
    advisorSubtitle: 'Automated credit health analysis & business intelligence',
    runAuditBtn: 'Run Monthly AI Audit',
    auditLoading: 'Gemini is analyzing your store ledger...',
    auditResult: 'Monthly Audit Report',
    auditReadySuccess: 'Monthly AI Audit Report is ready!',
    auditRecoveryRateSub: '{shopName} • Recovery Rate: {rate}%',
    rerunAuditTooltip: 'Re-run Audit',
    chatBoxTitle: 'Chat with AI Advisor',
    chatBoxSubtitle: 'Ask questions in English or Roman Urdu',
    chatPlaceholder: 'Ask: "Who owes the highest overdue balance?"',
    sendQuestion: 'Send',
    aiTypingNotice: 'AI Advisor is typing a response...',
    aiConnError: 'Sorry, could not connect: {msg}. Please try again shortly.',
    suggestedQ1: 'Which customers should I prioritize for recovery?',
    suggestedQ2: 'Who owes the highest overdue balance?',
    suggestedQ3: 'How healthy is my current collection rate?',
    suggestedQ4: 'How can I minimize bad debt this month?',
    defaultAiGreeting: 'Hello {name}! I am the AI Munshi for "{shopName}". You can ask me any question about your outstanding credit, cash recoveries, or individual customer accounts!',

    // Settings / Profile page
    settingsTitle: 'Shop Profile & Settings',
    settingsSubtitle: 'Update your shop information and security credentials',
    shopNameLabel: 'Shop Name',
    shopTypeLabel: 'Business Category',
    ownerNameLabel: 'Shopkeeper Name',
    emailLabel: 'Email Address',
    changePassword: 'Change Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    newPasswordPlaceholder: 'At least 6 characters',
    confirmPasswordPlaceholder: 'Re-enter your new password',
    saveChanges: 'Save Changes',
    profileSavedSuccess: 'Profile saved successfully!',
    passwordMismatch: 'New password and confirm password do not match.',
    passwordLengthError: 'Password must be at least 6 characters.',
    logoutCardTitle: 'Sign Out of Account',
    logoutCardSubtitle: 'Terminate your active session on this device',

    // Auth (Login / Register)
    loginTitle: 'Login to QistBook',
    loginSubtitle: 'Enter your email and password to access your store',
    signupTitle: 'Register Your Shop',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Need an account?',
    passwordLabel: 'Password',
    demoLoginBtn: '1-Click Demo Login (Haji Kiryana Store)',
    demoStoreName: 'Haji Kiryana & General Store',
  },
};

/**
 * Creates a translation function for a specific locale.
 * Supports:
 *   - Direct flat keys: t('welcomeUser', { name: 'Saad' })
 *   - Nested dot keys: t('home.welcome', { name: 'Saad' })
 *   - Property access: t.dashboard, t.welcomeUser
 */
export function createTranslateFunction(locale = 'ur') {
  const currentDict = translations[locale] || translations.ur;
  const fallbackDict = translations.en;

  const resolveKey = (dict, keyPath) => {
    if (!dict || !keyPath) return undefined;
    if (dict[keyPath] !== undefined) return dict[keyPath];
    // Support dot notation like 'home.welcome'
    if (typeof keyPath === 'string' && keyPath.includes('.')) {
      const parts = keyPath.split('.');
      let cur = dict;
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) {
          cur = cur[p];
        } else {
          return undefined;
        }
      }
      return cur;
    }
    return undefined;
  };

  const t = (key, params = {}) => {
    let text = resolveKey(currentDict, key);
    if (text === undefined) {
      text = resolveKey(fallbackDict, key);
    }
    if (text === undefined) {
      text = key;
    }

    if (typeof text === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(params[paramKey]));
      });
    }
    return text;
  };

  // Assign dictionary properties onto the function object for backwards-compatibility (e.g. t.dashboard)
  Object.assign(t, currentDict);

  return t;
}
