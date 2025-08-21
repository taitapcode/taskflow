'use client';
import React from 'react';
import cn from '@/lib/cn';
import Button from './Button';

type Props = {
  className?: string;
  title: string;
  description?: string;
  variant?: 'tasks' | 'events' | 'generic';
  actionHref?: string;
  actionLabel?: string;
};

function Illustration({ variant = 'generic' }: { variant?: Props['variant'] }) {
  const common = 'w-28 h-28 drop-shadow';
  if (variant === 'tasks') {
    return (
      <svg className={common} viewBox='0 0 120 120' fill='none' aria-hidden='true'>
        <defs>
          <linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='hsl(210 100% 60%)' />
            <stop offset='100%' stopColor='hsl(300 100% 60%)' />
          </linearGradient>
        </defs>
        <rect x='14' y='18' width='92' height='84' rx='10' fill='url(#g1)' opacity='0.15' />
        <rect x='22' y='30' width='76' height='8' rx='4' fill='url(#g1)' opacity='0.35' />
        <rect x='22' y='48' width='56' height='8' rx='4' fill='url(#g1)' opacity='0.45' />
        <rect x='22' y='66' width='66' height='8' rx='4' fill='url(#g1)' opacity='0.6' />
        <rect x='22' y='84' width='40' height='8' rx='4' fill='url(#g1)' opacity='0.45' />
        <circle cx='90' cy='50' r='6' fill='url(#g1)' />
        <path d='M86 50l2 2 5-5' stroke='white' strokeWidth='2' strokeLinecap='round' />
      </svg>
    );
  }
  if (variant === 'events') {
    return (
      <svg className={common} viewBox='0 0 120 120' fill='none' aria-hidden='true'>
        <defs>
          <linearGradient id='g2' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='hsl(150 100% 60%)' />
            <stop offset='100%' stopColor='hsl(220 100% 60%)' />
          </linearGradient>
        </defs>
        <rect x='18' y='24' width='84' height='72' rx='8' fill='url(#g2)' opacity='0.15' />
        <rect x='18' y='36' width='84' height='14' rx='6' fill='url(#g2)' opacity='0.35' />
        <rect x='30' y='60' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.6' />
        <rect x='48' y='60' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.45' />
        <rect x='66' y='60' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.45' />
        <rect x='84' y='60' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.3' />
        <rect x='30' y='78' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.3' />
        <rect x='48' y='78' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.6' />
        <rect x='66' y='78' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.3' />
        <rect x='84' y='78' width='12' height='12' rx='3' fill='url(#g2)' opacity='0.6' />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox='0 0 120 120' fill='none' aria-hidden='true'>
      <defs>
        <linearGradient id='g0' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='hsl(200 100% 60%)' />
          <stop offset='100%' stopColor='hsl(340 100% 60%)' />
        </linearGradient>
      </defs>
      <circle cx='60' cy='60' r='36' fill='url(#g0)' opacity='0.15' />
      <circle cx='60' cy='60' r='24' fill='url(#g0)' opacity='0.35' />
      <circle cx='60' cy='60' r='12' fill='url(#g0)' />
    </svg>
  );
}

export default function EmptyState({
  className,
  title,
  description,
  variant = 'generic',
  actionHref,
  actionLabel,
}: Props) {
  return (
    <div className={cn('relative flex flex-col items-center gap-4 text-center', className)}>
      <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        <div className='empty-orb orb--primary animate-float-a' />
        <div className='empty-orb orb--accent animate-float-b' />
      </div>
      <Illustration variant={variant} />
      <div>
        <h2 className='text-xl font-semibold'>{title}</h2>
        {description && <p className='text-foreground-500 mt-1 text-sm'>{description}</p>}
      </div>
      {actionHref && actionLabel && (
        <Button href={actionHref} variant='bordered' radius='full' size='sm'>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
