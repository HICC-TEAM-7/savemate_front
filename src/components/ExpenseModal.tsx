import { useState } from 'react';
import { FaCoins } from 'react-icons/fa';
import { BsCreditCardFill } from 'react-icons/bs';
import { FaWonSign } from 'react-icons/fa6';
import { ExpenseModalProps } from '../types';

const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}: ExpenseModalProps) => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'cash' | ''>(
    ''
  );

  const categories = ['식비', '선물', '여행', '카페'];

  const formatAmount = (value: string) => {
    const onlyNumbers = value.replace(/[^0-9]/g, '');
    if (!onlyNumbers) return '';
    return Number(onlyNumbers).toLocaleString('ko-KR');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  const handleSubmit = () => {
    if (!amount || !selectedCategory || !selectedPayment) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const numericAmount = Number(amount.replace(/,/g, ''));

    onSubmit({
      amount: numericAmount,
      category: selectedCategory,
      date: selectedDate,
      paymentMethod: selectedPayment,
    });

    // 모달 초기화
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAmount('');
    setSelectedCategory('');
    setSelectedPayment('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\./g, '.')
      .replace(/\s/g, '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-20"
        onClick={handleCancel}
      />

      {/* 모달 컨테이너 */}
      <div
        className="relative bg-white-10 backdrop-blur-modal rounded-lg shadow-modal p-6 w-80 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <h2 className="text-center text-lg font-bold mb-6">지출 내역 추가</h2>

        {/* 날짜 표시 */}
        <div className="inline-flex w-fit py-1 px-2 items-center gap-1 rounded bg-white-10 text-white text-xs font-normal mb-4">
          {formatDate(selectedDate)}
        </div>

        {/* 금액 입력 */}
        <div className="flex w-full h-10 py-1 px-2 items-center gap-2 rounded bg-white-10 mb-6">
          <div className="flex items-center justify-center text-white font-bold text-lg">
            <FaWonSign />
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white text-m font-normal placeholder-white-60"
            value={amount}
            onChange={handleAmountChange}
            placeholder="금액을 입력하세요."
          />
        </div>

        {/* 카테고리 선택 */}
        <div className="flex justify-between gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              className={`py-2 px-4 rounded text-m font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-white-20 text-white hover:bg-white-30'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 결제 수단 선택 */}
        <div className="flex justify-start gap-4 mb-16">
          <button
            className={`p-3 rounded-lg transition-all duration-200 ${
              selectedPayment === 'card'
                ? 'bg-white-30 scale-110'
                : 'hover:bg-white-15'
            }`}
            onClick={() => setSelectedPayment('card')}
          >
            <BsCreditCardFill size={32} color="white" />
          </button>

          <button
            className={`p-3 rounded-lg transition-all duration-200 ${
              selectedPayment === 'cash'
                ? 'bg-white-30 scale-110'
                : 'hover:bg-white-15'
            }`}
            onClick={() => setSelectedPayment('cash')}
          >
            <FaCoins size={32} color="white" />
          </button>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <button
            className="flex-1 py-3 px-6 bg-white-20 hover:bg-white-30 text-white font-medium rounded-lg transition-all duration-200"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className="flex-1 py-3 px-6 bg-white-40 hover:bg-white-50 text-white font-medium rounded-lg transition-all duration-200"
            onClick={handleSubmit}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
