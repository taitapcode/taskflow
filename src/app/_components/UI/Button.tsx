'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import cn from '@/lib/cn';

type ButtonColor = 'default' | 'primary' | 'warning' | 'success' | 'danger';
type ButtonVariant = 'solid' | 'bordered';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  isDisabled?: boolean;
  disabled?: boolean;
  onPress?: React.MouseEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
};

function radiusClass(radius: ButtonRadius | undefined) {
  switch (radius) {
    case 'none':
      return 'rounded-none';
    case 'sm':
      return 'rounded';
    case 'md':
      return 'rounded-md';
    case 'lg':
      return 'rounded-lg';
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded-md';
  }
}

function sizeClass(size: ButtonSize | undefined) {
  switch (size) {
    case 'sm':
      return 'h-8 px-3 text-sm';
    case 'lg':
      return 'h-11 px-5 text-base';
    case 'md':
    default:
      return 'h-10 px-4 text-sm';
  }
}

function solidColor(color: ButtonColor | undefined) {
  switch (color) {
    case 'primary':
      return 'bg-primary text-white hover:saturate-150 hover:brightness-110';
    case 'warning':
      return 'bg-warning text-black hover:bg-warning/90';
    case 'success':
      return 'bg-success text-black hover:bg-success/90';
    case 'danger':
      return 'bg-danger text-white hover:bg-danger/90';
    case 'default':
    default:
      return 'bg-content3 text-foreground hover:bg-content3/80';
  }
}

function borderedColor(color: ButtonColor | undefined) {
  switch (color) {
    case 'primary':
      return 'border border-primary text-primary hover:bg-primary/10';
    case 'warning':
      return 'border border-warning text-warning hover:bg-warning/10';
    case 'success':
      return 'border border-success text-success hover:bg-success/10';
    case 'danger':
      return 'border border-danger text-danger hover:bg-danger/10';
    case 'default':
    default:
      return 'border border-neutral-700 text-foreground hover:bg-content3/40';
  }
}

export default function Button({
  className,
  children,
  color = 'default',
  variant = 'solid',
  size = 'md',
  radius = 'md',
  isDisabled,
  disabled,
  onPress,
  onClick,
  href,
  type = 'button',
}: ButtonProps) {
  const isDisabledFinal = isDisabled ?? disabled ?? false;
  const base = cn(
    'inline-flex select-none items-center justify-center gap-2 font-medium transition-all cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
    'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClass(size),
    radiusClass(radius),
    variant === 'bordered' ? borderedColor(color) : solidColor(color),
    className,
  );

  // Use Motion for subtle hover/tap feedback
  const motionProps = {
    whileHover: isDisabledFinal ? undefined : { y: -1 },
    whileTap: isDisabledFinal ? undefined : { scale: 0.98 },
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  } as const;

  if (href) {
    return (
      <motion.div {...motionProps} className='inline-flex'>
        <Link href={href} className={base} aria-disabled={isDisabledFinal} onClick={onPress ?? onClick}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      className={base}
      disabled={isDisabledFinal}
      onClick={onPress ?? onClick}
      type={type}
    >
      {children}
    </motion.button>
  );
}
