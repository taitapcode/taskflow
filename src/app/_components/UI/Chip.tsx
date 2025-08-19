'use client';
import React from 'react';
import cn from '@/lib/cn';

type ChipColor = 'default' | 'primary' | 'warning' | 'success' | 'danger';

export type ChipProps = {
  className?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  color?: ChipColor;
  variant?: 'solid' | 'flat';
};

export default function Chip({
  className,
  children,
  size = 'md',
  color = 'default',
  variant = 'solid',
}: ChipProps) {
  const sizeClass = size === 'sm' ? 'text-[11px] h-6 px-2' : 'text-xs h-7 px-2.5';
  const base = 'inline-flex items-center justify-center rounded-full font-medium';

  const solid = {
    default: 'bg-content3 text-foreground',
    primary: 'bg-primary text-background',
    warning: 'bg-warning text-black',
    success: 'bg-success text-black',
    danger: 'bg-danger text-background',
  } as const;

  const flat = {
    default: 'bg-content3/20 text-foreground',
    primary: 'bg-primary/15 text-primary',
    warning: 'bg-warning/15 text-warning',
    success: 'bg-success/15 text-success',
    danger: 'bg-danger/15 text-danger',
  } as const;

  const palette = variant === 'flat' ? flat : solid;

  return <span className={cn(base, sizeClass, palette[color], className)}>{children}</span>;
}
