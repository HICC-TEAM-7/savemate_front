import { forwardRef } from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
};

const FormButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      isLoading = false,
      loadingText = '처리 중...',
      className = '',
      disabled,
      children,
      ...rest
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
        className={`${base} ${className}`}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        aria-live="polite"
        {...rest}
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
