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

export interface Mission {
  id: string;
  title: string;
  subtitle?: string;     // 없으면 "X일째 달성중!" 자동 생성 (MissionStatus에서 처리)
  targetDays: number;
  achievedDays?: number; // 일수 기준 진행률용
  budgetWon?: number;    // 금액 기반 진행률(목표 금액)
  spentWon?: number;     // 금액 기반 진행률(사용 금액)
  progress?: number;     // 0~1 직접 지정 시 최우선
}
