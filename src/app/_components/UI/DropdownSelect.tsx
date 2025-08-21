'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
import cn from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'flat' | 'bordered';

export type Option = { label: string; value: string };
export type DropdownSelectProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  size?: Size;
  variant?: Variant;
  className?: string;
  isDisabled?: boolean;
};

export default function DropdownSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  size = 'sm',
  variant = 'flat',
  className,
  isDisabled,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  const sizeClass =
    size === 'lg'
      ? 'h-12 text-base px-3'
      : size === 'sm'
        ? 'h-9 text-sm px-2.5'
        : 'h-10 text-sm px-3';
  const variantClass =
    variant === 'flat'
      ? 'bg-content2 text-foreground hover:bg-content2/80 focus:bg-content2/90'
      : 'bg-content1 text-foreground hover:bg-content1/80 focus:bg-content2/80';

  const selectOption = useCallback(
    (idx: number) => {
      const opt = options[idx];
      if (!opt) return;
      onChange?.(opt.value);
      setOpen(false);
      setActiveIndex(-1);
      btnRef.current?.focus();
    },
    [onChange, options],
  );

  const onKeyDownBtn: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (isDisabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => {
        const base = prev === -1 ? options.findIndex((o) => o.value === value) : prev;
        const dir = e.key === 'ArrowDown' ? 1 : -1;
        const next = (base + dir + options.length) % options.length;
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  const onKeyDownList: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const base = prev === -1 ? options.findIndex((o) => o.value === value) : prev;
        const dir = e.key === 'ArrowDown' ? 1 : -1;
        const next = (base + dir + options.length) % options.length;
        return next;
      });
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) selectOption(activeIndex);
    }
  };

  useEffect(() => {
    if (open) {
      const handler = (ev: MouseEvent) => {
        if (
          listRef.current &&
          btnRef.current &&
          !listRef.current.contains(ev.target as Node) &&
          !btnRef.current.contains(ev.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [open]);

  const labelId = useId();

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      {label && (
        <span id={labelId} className='text-foreground-600 text-xs'>
          {label}
        </span>
      )}
      <div className='relative inline-block w-full'>
        <button
          type='button'
          ref={btnRef}
          disabled={isDisabled}
          aria-haspopup='listbox'
          aria-expanded={open}
          aria-labelledby={label ? labelId : undefined}
          onClick={() => !isDisabled && setOpen((o) => !o)}
          onKeyDown={onKeyDownBtn}
          className={cn(
            'w-full rounded-md border border-neutral-700 text-left transition-colors outline-none',
            sizeClass,
            variantClass,
            isDisabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span className={cn('block truncate', !selected && 'opacity-60')}>
            {selected ? selected.label : placeholder}
          </span>
          <span className='text-foreground-600 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2'>
            <svg width='14' height='14' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
              <path d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z' />
            </svg>
          </span>
        </button>

        {open && (
          <ul
            ref={listRef}
            role='listbox'
            tabIndex={-1}
            onKeyDown={onKeyDownList}
            className='bg-content1 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-700 py-1 shadow-lg focus:outline-none'
          >
            {options.map((opt, idx) => {
              const isActive = idx === activeIndex || opt.value === value;
              return (
                <li
                  key={opt.value}
                  role='option'
                  aria-selected={opt.value === value}
                  className={cn(
                    'hover:bg-content3/40 cursor-pointer px-3 py-2 text-sm select-none',
                    isActive && 'bg-content3/40',
                  )}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => selectOption(idx)}
                >
                  <span className='block truncate'>{opt.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
