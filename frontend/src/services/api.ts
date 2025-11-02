import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL 
  : import.meta.env.PROD
    ? 'https://finance-tracker-backend.onrender.com'  // Will update after deployment
    : 'http://localhost:8000';
// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
    
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => api.post('/auth/register', userData),
  
  getProfile: () => api.get('/users/me'),
};

// Account API calls
export const accountAPI = {
  getAccounts: () => api.get('/accounts'),
  
  createAccount: (accountData: {
    account_name: string;
    account_type: string;
    balance: number;
  }) => api.post('/accounts', accountData),
  
  updateAccount: (id: number, accountData: any) => 
    api.put(`/accounts/${id}`, accountData),
    
  deleteAccount: (id: number) => api.delete(`/accounts/${id}`),
};

// Transaction API calls
export const transactionAPI = {
  getTransactions: () => api.get('/transactions'),
  
  createTransaction: (transactionData: {
    account_id: number;
    category_id: number;
    transaction_type: string;
    amount: number;
    description: string;
    transaction_date: string;
    payment_method?: string;
    notes?: string;
  }) => api.post('/transactions', transactionData),
  
  updateTransaction: (id: number, transactionData: any) => 
    api.put(`/transactions/${id}`, transactionData),
    
  deleteTransaction: (id: number) => api.delete(`/transactions/${id}`),
};

// Category API calls
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  
  createCategory: (categoryData: {
    category_name: string;
    category_type: string;
    icon?: string;
    color?: string;
  }) => api.post('/categories', categoryData),
};

// Budget API calls
export const budgetAPI = {
  getBudgets: () => api.get('/budgets'),
  
  createBudget: (budgetData: {
    category_id: number;
    budget_amount: number;
    month: number;
    year: number;
  }) => api.post('/budgets', budgetData),
  
  updateBudget: (id: number, budgetData: {
    category_id: number;
    budget_amount: number;
    month: number;
    year: number;
  }) => api.put(`/budgets/${id}`, budgetData),
  
  deleteBudget: (id: number) => api.delete(`/budgets/${id}`),
};

export default api;

// Settings API calls
export const settingsAPI = {
  changePassword: (oldPassword: string, newPassword: string) =>
    api.put('/users/me/password', null, {
      params: {
        old_password: oldPassword,
        new_password: newPassword
      }
    }),

  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }) => api.put('/users/me/profile', null, { params: data }),

  deleteAccount: (password: string) =>
    api.delete('/users/me', {
      params: { password }
    }),

  exportData: () => api.get('/users/me/export'),
};