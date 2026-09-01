export type Language = 'ur' | 'en';

export type TransactionType = 'UDHAAR' | 'WASOOLI';

export interface Shopkeeper {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  city?: string;
  email?: string;
  currency: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  shopkeeperId: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  totalUdhaar: number;
  totalWasool: number;
  balance: number; // totalUdhaar - totalWasool (positive = owes shopkeeper)
  lastTransactionDate: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  shopkeeperId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  type: TransactionType;
  amount: number;
  date: string;
  notes?: string;
  itemsSummary?: string;
  dueDate?: string;
  createdAt: string;
}

export interface AIInsight {
  summary: string;
  totalCreditGiven: number;
  totalRecovered: number;
  recoveryRatePercent: number;
  topDebtors: Array<{
    customerId: string;
    customerName: string;
    amount: number;
    phone: string;
    pendingDays: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    udhaar: number;
    wasool: number;
  }>;
  smartAdvice: string[];
  generatedAt: string;
  isAiGenerated: boolean;
}

export interface DbStatusResponse {
  connected: boolean;
  type: 'mongodb' | 'memory';
  message: string;
}
