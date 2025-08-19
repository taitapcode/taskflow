"use client";
import React from 'react';
import cn from '@/lib/cn';

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

type Props<T> = {
  ariaLabel: string;
  data: T[];
  columns: Column<T>[];
  getKey: (row: T, index: number) => React.Key;
  emptyContent?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T, index: number) => string | undefined;
};

export default function DataTable<T>({
  ariaLabel,
  data,
  columns,
  getKey,
  emptyContent = 'No data',
  className,
  onRowClick,
  rowClassName,
}: Props<T>) {
  return (
    <div className={cn('overflow-x-auto', className)} aria-label={ariaLabel} role='region'>
      <table className='min-w-full border-separate border-spacing-0 text-sm'>
        <thead className='sticky top-0 z-10 bg-content3/60 backdrop-blur supports-[backdrop-filter]:bg-content3/40'>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope='col'
                className={cn(
                  'px-3 py-2 text-left font-medium text-foreground-600 border-b border-neutral-700',
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                className='px-3 py-6 text-center text-foreground-500 border-b border-neutral-800'
                colSpan={columns.length}
              >
                {emptyContent}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const clickable = Boolean(onRowClick);
              return (
                <tr
                  key={getKey(row, idx)}
                  className={cn(
                    'hover:bg-content3/30',
                    clickable && 'cursor-pointer',
                    rowClassName?.(row, idx),
                  )}
                  onClick={clickable ? () => onRowClick?.(row) : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick?.(row);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((c) => (
                    <td key={c.key} className='px-3 py-2 align-middle border-b border-neutral-800'>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
