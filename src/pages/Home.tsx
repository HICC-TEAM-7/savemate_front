import { useState } from 'react';
import { format } from 'date-fns';
import { useModal } from '../hooks/useModal';
import ExpenseModal from '../components/modal/ExpenseModal';
import { Expense, ApiError } from '../types';
import { createExpense } from '../api/expense';
import Top from '../components/layout/Top';
import Middle from '../components/layout/Middle';
import Bottom from '../components/layout/Bottom';

const Home = () => {
  const { isOpen, openModal, closeModal } = useModal();

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
    try {
      const result = await createExpense(expenseData);
      console.log(result);
      alert(
        `지출이 등록되었습니다!\n금액: ${expenseData.amount.toLocaleString()}원`
      );
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* 공통 최대폭 컨테이너 */}
      <div className="w-full max-w-[1080px] px-5 pb-[40px]">
        {/* 상단 */}
        <div className="mt-[40px]">
          <Top />
        </div>

        {/* 중단(캘린더 + 그래프) */}
        <div className="mt-6">
          <Middle onSelectDate={handleCalendarSelect} />
        </div>

        {/* 하단(소비 내역 리스트) */}
        <div className="mt-6">
          <Bottom />
        </div>
      </div>

      {/* 지출 등록 모달 */}
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
