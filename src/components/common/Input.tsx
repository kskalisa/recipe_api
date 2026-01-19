// src/components/common/Input.tsx
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  validate?: (value: string) => string | undefined;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error: externalError, icon, className, validate, onBlur, onChange, ...props }, ref) => {
    const [error, setError] = useState<string | undefined>(externalError);
    const [touched, setTouched] = useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      
      if (validate) {
        const validationError = validate(e.target.value);
        setError(validationError);
      } else if (props.required && !e.target.value.trim()) {
        setError(`${label || 'This field'} is required`);
      } else {
        setError(undefined);
      }

      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (touched && validate) {
        const validationError = validate(e.target.value);
        setError(validationError);
      } else if (touched && props.required && !e.target.value.trim()) {
        setError(`${label || 'This field'} is required`);
      } else if (touched) {
        setError(undefined);
      }

      onChange?.(e);
    };

    const displayError = externalError || error;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full px-4 py-2.5 border border-gray-300 rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'transition-all duration-200',
                icon && 'pl-10',
                displayError && 'border-red-500 focus:ring-red-500 bg-red-50'
              ),
              className
            )}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {displayError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
        {displayError && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {displayError}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
