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
