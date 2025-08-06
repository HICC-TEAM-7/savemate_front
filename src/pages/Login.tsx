import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';

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
          alt="save mate"
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
        <Input
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleInputChange('email')}
          disabled={isLoading}
          required
        />

        {/* 비밀번호 입력 */}
        <Input
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleInputChange('password')}
          disabled={isLoading}
          required
        />

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={
            isLoading || !formData.email.trim() || !formData.password.trim()
          }
          className="w-full h-[4rem] px-[1.5625rem] py-[0.625rem] flex justify-center items-center gap-[0.625rem] self-stretch rounded-xl border border-white/20 bg-white/10 shadow-[4px_4px_15px_0_rgba(0,0,0,0.10)] hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-200 backdrop-blur-modal mt-8"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              로그인 중...
            </span>
          ) : (
            'LOGIN'
          )}
        </button>
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
