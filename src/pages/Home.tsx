// src/pages/Home.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import { useModal } from '../hooks/useModal';
import ExpenseModal from '../components/modal/ExpenseModal';
import { Expense, ApiError } from '../types';
import { createExpense } from '../api/expense';
import Top from '../components/layout/Top';
import Middle from '../components/layout/Middle';

const Home = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  // 선택 날짜: 기본은 오늘
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  // 캘린더에서 날짜 클릭 시 모달 열기
  const handleCalendarSelect = (date: Date) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'));
    openModal();
  };

  const handleExpenseSubmit = async (expenseData: Omit<Expense, 'id'>) => {
    setIsLoading(true);
    try {
      const result = await createExpense(expenseData);
      console.log(result);
      alert(`지출이 등록되었습니다!\n금액: ${expenseData.amount.toLocaleString()}원`);
    } catch (error) {
      console.error(error);
      const apiError = error as ApiError;
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
    <div className="min-h-screen flex flex-col">
      {/*상단*/}
      <div className="mt-[40px]">
        <Top />
      </div>

      <div className="mt-6">
        {/* 날짜 클릭 시 모달 열리도록 핸들러 전달 */}
        <Middle onSelectDate={handleCalendarSelect} />
      </div>

      <div className="flex flex-col flex-1 items-center justify-center gap-8">
        <ExpenseModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={handleExpenseSubmit}
          selectedDate={selectedDate}
        />
      </div>
      
    </div>
  );
};

export default Home;
