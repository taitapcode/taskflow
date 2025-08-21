'use client';
import React from 'react';
import Image from 'next/image';
import cn from '@/lib/cn';

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: number;
  fallback?: React.ReactNode;
};

export default function Avatar({
  src,
  alt = 'avatar',
  className,
  size = 36,
  fallback,
}: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn('rounded-full border border-neutral-700 object-cover', className)}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        'bg-content2 text-foreground-500 grid place-items-center rounded-full border border-dashed border-neutral-700',
        className,
      )}
    >
      {fallback ?? null}
    </div>
  );
}
