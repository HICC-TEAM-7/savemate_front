import { useState } from 'react';
import { useModal } from '../hooks/useModal';
import ExpenseModal from '../components/ExpenseModal';
import { Expense, ApiError } from '../types';
import { createExpense } from '../api/expense';

const Home = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  // 임의
  const selectedDate = new Date().toISOString().split('T')[0];

  const handleExpenseSubmit = async (expenseData: Omit<Expense, 'id'>) => {
    setIsLoading(true);

    try {
      const result = await createExpense(expenseData);
      console.log(result);
      alert(
        `지출이 등록되었습니다!\n금액: ${expenseData.amount.toLocaleString()}원`
      );
    } catch (error) {
      console.error(error);

      const apiError = error as ApiError;

      // 에러 처리
      if (apiError.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else if (apiError.response?.status === 400) {
        alert('입력 정보를 확인해주세요.');
      } else {
        alert('지출 등록에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 임의 레이아웃
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <button
        onClick={openModal}
        disabled={isLoading}
        className="px-8 py-4 bg-white-20 hover:bg-white-30 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-200 shadow-modal"
      >
        가계부 모달
      </button>

      <ExpenseModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleExpenseSubmit}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Home;
