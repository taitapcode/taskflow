'use client';
import React from 'react';
import cn from '@/lib/cn';

type SelectSize = 'sm' | 'md' | 'lg';
type SelectVariant = 'bordered' | 'flat';

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'color'> & {
  label?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
};

export default function Select({
  label,
  size = 'md',
  variant = 'bordered',
  startContent,
  endContent,
  isInvalid,
  isDisabled,
  errorMessage,
  className,
  children,
  ...props
}: SelectProps) {
  const sizeClasses = size === 'lg' ? 'h-12 text-base' : size === 'sm' ? 'h-9 text-sm' : 'h-10 text-sm';
  const leftPad = startContent ? 'pl-10' : 'pl-3';
  const rightPad = endContent ? 'pr-10' : 'pr-9';
  // Use solid backgrounds to avoid UA white flash on focus/open
  const variantClasses =
    variant === 'flat'
      ? 'bg-content2 text-foreground hover:bg-content2/80 focus:bg-content2/90'
      : 'bg-content1 text-foreground hover:bg-content1/80 focus:bg-content2/80';
  const borderClasses = isInvalid ? 'border-danger' : 'border-neutral-700';

  return (
    <label className='flex w-full flex-col gap-1'>
      {label && <span className='text-xs text-foreground-600'>{label}</span>}
      <div className='relative'>
        {startContent && (
          <span className={cn('pointer-events-none absolute left-3 top-1/2 -translate-y-1/2', isInvalid ? 'text-danger' : 'text-current')}>
            {startContent}
          </span>
        )}
        <select
          className={cn(
            'w-full rounded-md border outline-none transition-colors appearance-none',
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
          style={{ colorScheme: 'dark' }}
          {...props}
        >
          {children}
        </select>
        <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-600'>
          {endContent ?? (
            <svg width='14' height='14' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
              <path d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z' />
            </svg>
          )}
        </span>
      </div>
      {errorMessage && <span className='text-danger text-xs leading-4'>{errorMessage}</span>}
    </label>
  );
}
