import { useModal } from '../hooks/useModal';
import ExpenseModal from '../components/ExpenseModal';
import { Expense } from '../types';

const Home = () => {
  const { isOpen, openModal, closeModal } = useModal();

  // 임시로 오늘 날짜 사용 (나중에 달력에서 선택한 날짜로 변경)
  const selectedDate = new Date().toISOString().split('T')[0];

  const handleExpenseSubmit = (expenseData: Omit<Expense, 'id'>) => {
    // ID 생성 및 데이터 처리
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(), // 임시 ID 생성
    };

    console.log('새 지출 내역:', newExpense);
    // TODO: 상태 관리나 API 호출
  };

  return (
    // TODO: 수정하셔도 됩니다
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <button
        onClick={openModal}
        className="px-8 py-4 bg-white-20 hover:bg-white-30 text-white font-bold rounded-lg transition-all duration-200 shadow-modal"
      >
        임시 버튼
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
