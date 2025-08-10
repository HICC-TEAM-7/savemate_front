import { forwardRef } from 'react';

interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    {
      type = 'button',
      onClick,
      isLoading = false,
      loadingText = '처리 중...',
      disabled = false,
      children,
      className = '',
    },
    ref
  ) => {
    const base =
      'w-full h-[4rem] px-[1.5625rem] py-[0.625rem] flex justify-center items-center gap-[0.625rem] ' +
      'self-stretch rounded-xl border border-white/20 bg-white/10 ' +
      'shadow-[4px_4px_15px_0_rgba(0,0,0,0.10)] hover:bg-white/20 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg ' +
      'transition-all duration-200 backdrop-blur-modal';

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        aria-live="polite"
        className={`${base} ${className}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingText}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

FormButton.displayName = 'FormButton';

export default FormButton;
