import axios from 'axios';
import { Expense } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (인증 토큰 추가)
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 지출 생성 API
export const createExpense = async (expenseData: Omit<Expense, 'id'>) => {
  try {
    const response = await api.post('/api/v1/expenses', {
      date: expenseData.date,
      paymentType: expenseData.paymentMethod === 'card' ? '카드' : '현금',
      category: expenseData.category,
      amount: expenseData.amount,
    });

    return response.data;
  } catch (error) {
    console.error('지출 생성 실패:', error);
    throw error;
  }
};

export default api;
