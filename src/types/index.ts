export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: 'card' | 'cash';
}

export interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  selectedDate: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: T;
}

// 에러 응답 타입
export interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message: string;
}
