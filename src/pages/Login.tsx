import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/ui/FormInput';
import FormButton from '../components/ui/FormButton';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 로그인 API 호출
      console.log('로그인 시도', formData);

      // 임시 성공 시
      alert('로그인 성공 (테스트)');
    } catch (error) {
      console.error('로그인 실패', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-16">
        <img
          src="/assets/logo/logo.png"
          alt="logo"
          className="h-16 md:h-20 object-contain"
        />
      </div>

      {/* 로그인 폼 */}
      <form
        className="w-full max-w-sm space-y-4"
        onSubmit={e => {
          e.preventDefault();
          handleLogin();
        }}
      >
        {/* 이메일 입력 */}
        <FormInput
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleInputChange('email')}
          disabled={isLoading}
          required
        />

        {/* 비밀번호 입력 */}
        <FormInput
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleInputChange('password')}
          disabled={isLoading}
          required
        />

        {/* 로그인 버튼 */}
        <FormButton
          type="submit"
          isLoading={isLoading}
          loadingText="로그인 중..."
          disabled={!formData.email.trim() || !formData.password.trim()}
          className="mt-8"
        >
          LOGIN
        </FormButton>
      </form>

      {/* 부가 링크 */}
      <div className="flex justify-center space-x-2 text-sm text-white-60 pt-6">
        <button className="hover:text-white transition-colors">
          아이디 찾기
        </button>
        <span className="text-white-40">|</span>
        <button className="hover:text-white transition-colors">
          비밀번호 찾기
        </button>
        <span className="text-white-40">|</span>
        <button
          className="hover:text-white transition-colors"
          onClick={handleSignup}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
