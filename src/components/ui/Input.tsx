import { forwardRef } from 'react';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', style, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* 입력 필드 */}
        <input
          ref={ref}
          style={{
            fontFamily: 'Pretendard',
            ...style,
          }}
          className={`
            flex h-16 px-6 items-center gap-2.5 
            rounded-xl bg-black bg-opacity-10 
            text-white-80 text-lg font-normal
            leading-6 tracking-tight
            border-none outline-none w-full
            placeholder:text-white-80
            ${className}
          `}
          {...props}
        />

        {/* 에러 메시지 */}
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
