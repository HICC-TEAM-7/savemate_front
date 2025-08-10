import { forwardRef } from 'react';

interface FormInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      type = 'text',
      value,
      onChange,
      placeholder,
      disabled = false,
      required = false,
      error,
      className = '',
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            flex h-16 px-6 items-center gap-2.5 
            rounded-xl bg-black/10
            text-white-80 text-lg font-normal
            leading-6 tracking-tight
            border-none outline-none w-full
            placeholder:text-white-80
            transition-colors duration-200
            hover:bg-black/20
            focus:bg-black/20
            ${className}
          `}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
