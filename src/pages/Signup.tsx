import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/ui/FormInput';
import FormButton from '../components/ui/FormButton';

type DupStatus = 'idle' | 'checking' | 'available' | 'taken';

const Signup = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [dupStatus, setDupStatus] = useState<DupStatus>('idle');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 검증 로직
  const nicknameValid = useMemo(() => nickname.trim().length >= 2, [nickname]);
  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );
  const pwValid = useMemo(() => password.length >= 8, [password]);
  const pwMatch = useMemo(
    () => password && password === password2,
    [password, password2]
  );

  const canSubmit =
    nicknameValid &&
    dupStatus === 'available' &&
    emailValid &&
    pwValid &&
    pwMatch;

  // 닉네임 중복 확인
  const handleDupCheck = async () => {
    if (!nicknameValid) return;
    setDupStatus('checking');
    // TODO: API 호출
  };

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    // TODO: API 호출
    alert('회원가입 성공 (테스트)');
    setIsSubmitting(false);
    navigate('/login');
  };

  const handleMain = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-10">
        <img
          src="/assets/logo/logo.png"
          alt="logo"
          className="h-16 md:h-20 object-contain cursor-pointer"
          onClick={handleMain}
        />
      </div>

      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
        {/* 닉네임 + 중복확인 */}
        <div className="mb-8">
          <label className="block mb-4 text-white font-semibold">
            회원정보 입력
          </label>
          <div className="flex gap-2">
            <FormInput
              type="text"
              placeholder="닉네임 설정"
              value={nickname}
              onChange={e => {
                setNickname(e.target.value);
                setDupStatus('idle');
              }}
              disabled={isSubmitting}
              required
              className="flex-1"
              error={
                !nickname
                  ? undefined
                  : !nicknameValid
                    ? '닉네임은 2자 이상 입력해주세요.'
                    : dupStatus === 'taken'
                      ? '이미 사용 중인 닉네임입니다.'
                      : undefined
              }
            />
            <FormButton
              type="button"
              onClick={handleDupCheck}
              isLoading={dupStatus === 'checking'}
              loadingText="확인 중"
              disabled={!nicknameValid || isSubmitting}
              className="flex w-24 h-16 p-2.5 justify-center items-center gap-2.5 rounded-lg bg-white/20 text-sm font-bold leading-[1.3125rem] tracking-[-0.0175rem]"
            >
              중복 확인
            </FormButton>
          </div>
          <p className="text-xs text-white-60 mt-1">
            *영문과 숫자로만 구성된 글자여야 합니다.
          </p>
          {dupStatus === 'available' && (
            <p className="text-xs text-emerald-300 mt-1">
              사용 가능한 닉네임입니다.
            </p>
          )}
        </div>

        {/* 이메일 */}
        <FormInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
          error={
            email && !emailValid
              ? '올바른 이메일 형식을 입력하세요.'
              : undefined
          }
        />

        {/* 비밀번호 */}
        <FormInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
          error={
            password && !pwValid
              ? '비밀번호는 8자 이상이어야 합니다.'
              : undefined
          }
        />

        {/* 비밀번호 확인 */}
        <FormInput
          type="password"
          placeholder="비밀번호 확인"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          disabled={isSubmitting}
          required
          error={
            password2 && !pwMatch ? '비밀번호가 일치하지 않습니다.' : undefined
          }
        />

        {/* 가입 버튼 */}
        <FormButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="가입 중..."
          disabled={!canSubmit || isSubmitting}
          className="mt-4"
        >
          SIGN IN
        </FormButton>
      </form>
    </div>
  );
};

export default Signup;
