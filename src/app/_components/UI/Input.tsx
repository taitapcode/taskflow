'use client';
import React from 'react';
import cn from '@/lib/cn';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'bordered' | 'flat';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> & {
  label?: string;
  size?: InputSize;
  variant?: InputVariant;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
  color?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
  label,
  size = 'md',
  variant = 'bordered',
  startContent,
  endContent,
  isInvalid,
  isDisabled,
  errorMessage,
  className,
  ...props
  }: InputProps,
  ref,
) {
  const sizeClasses =
    size === 'lg' ? 'h-12 text-base' : size === 'sm' ? 'h-9 text-sm' : 'h-10 text-sm';
  const leftPad = startContent ? 'pl-10' : 'pl-3';
  const rightPad = endContent ? 'pr-10' : 'pr-3';
  const variantClasses =
    variant === 'flat'
      ? 'bg-content2/40 hover:bg-content2/50 focus:bg-content2/60'
      : 'bg-transparent';
  const borderClasses = isInvalid ? 'border-danger' : 'border-neutral-700';

  return (
    <label className='flex w-full flex-col gap-1'>
      {label && <span className='text-xs text-foreground-600'>{label}</span>}
      <div className='relative'>
        {startContent && (
          <span
            className={cn(
              'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
              isInvalid ? 'text-danger' : 'text-current',
            )}
          >
            {startContent}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-md border outline-none transition-colors',
            isInvalid
              ? 'text-danger placeholder:text-danger/70 focus:ring-2 focus:ring-danger/60'
              : 'text-current placeholder:text-current placeholder:opacity-60 focus:ring-2 focus:ring-primary/60',
            sizeClasses,
            leftPad,
            rightPad,
            variantClasses,
            borderClasses,
            className,
          )}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          {...props}
        />
        {endContent && (
          <span className='absolute right-3 top-1/2 -translate-y-1/2'>
            {endContent}
          </span>
        )}
      </div>
      {errorMessage && (
        <span className='text-danger text-xs leading-4'>{errorMessage}</span>
      )}
    </label>
  );
});

export default Input;
