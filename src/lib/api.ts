import { Customer, Transaction, AIInsight, Shopkeeper, DbStatusResponse } from '../types';

const TOKEN_KEY = 'qistbook_auth_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Use an AbortController with 8 second timeout to prevent infinite hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Request failed with status ' + res.status }));
      throw new Error(errorData.error || 'Server error occurred');
    }

    return await res.json() as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please retry.');
    }
    throw err;
  }
}

export const api = {
  getDbStatus: () => request<DbStatusResponse>('/api/db/status'),
  
  // Auth
  register: (data: { name: string; shopName: string; phone: string; password: string; city?: string }) =>
    request<{ token: string; shopkeeper: Shopkeeper }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (data: { phone: string; password: string }) =>
    request<{ token: string; shopkeeper: Shopkeeper }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  demoLogin: () =>
    request<{ token: string; shopkeeper: Shopkeeper }>('/api/auth/demo', {
      method: 'POST'
    }),

  getCurrentUser: () => request<{ shopkeeper: Shopkeeper }>('/api/auth/me'),

  // Customers
  getCustomers: () => request<{ customers: Customer[] }>('/api/customers'),
  
  createCustomer: (data: { name: string; phone: string; address?: string; notes?: string }) =>
    request<{ customer: Customer }>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateCustomer: (id: string, data: Partial<Customer>) =>
    request<{ customer: Customer }>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteCustomer: (id: string) =>
    request<{ success: boolean }>(`/api/customers/${id}`, {
      method: 'DELETE'
    }),

  // Transactions
  getTransactions: (customerId?: string) => {
    const query = customerId ? `?customerId=${encodeURIComponent(customerId)}` : '';
    return request<{ transactions: Transaction[] }>(`/api/transactions${query}`);
  },

  createTransaction: (data: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    type: 'UDHAAR' | 'WASOOLI';
    amount: number;
    date?: string;
    notes?: string;
    itemsSummary?: string;
    dueDate?: string;
  }) =>
    request<{ transaction: Transaction; customer: Customer }>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteTransaction: (id: string) =>
    request<{ success: boolean }>(`/api/transactions/${id}`, {
      method: 'DELETE'
    }),

  // AI Insights
  getAiInsights: (language: 'ur' | 'en') =>
    request<{ insights: AIInsight }>('/api/ai/insights', {
      method: 'POST',
      body: JSON.stringify({ language })
    }),

  askAiQuestion: (question: string, language: 'ur' | 'en') =>
    request<{ answer: string }>('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question, language })
    }),

  // WhatsApp Link
  getWhatsAppLink: (data: { customerName: string; phone: string; balance: number; shopName: string; language: 'ur' | 'en' }) =>
    request<{ link: string; message: string; phone: string }>('/api/whatsapp/link', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};
