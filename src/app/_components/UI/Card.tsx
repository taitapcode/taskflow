'use client';
import React from 'react';
import cn from '@/lib/cn';
import { motion, useReducedMotion } from 'motion/react';

export type CardProps = {
  className?: string;
  shadow?: 'none' | 'sm' | 'md';
  children?: React.ReactNode;
};

export function Card({ className, shadow = 'sm', children }: CardProps) {
  const prefersReducedMotion = useReducedMotion();
  const shadowClass =
    shadow === 'md'
      ? 'shadow-md shadow-black/20'
      : shadow === 'sm'
        ? 'shadow-sm shadow-black/20'
        : '';
  const commonClass = cn('bg-content2 rounded-lg border border-neutral-700', shadowClass, className);
  if (prefersReducedMotion) {
    return <div className={commonClass}>{children}</div>;
  }
  return (
    <motion.div className={commonClass} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
