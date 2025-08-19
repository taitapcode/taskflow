"use client";
import { Button } from '@/app/_components/UI';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type Props = {
  id: number;
  name: string;
  spaceId: number | null;
  spaceName: string | null;
  deadline: string | null;
};

export default function TaskActions({ id: _id, name: _name, spaceId, spaceName: _spaceName, deadline: _deadline }: Props) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${pathname}`;
  }, [pathname]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [link]);


  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Button href='/app/tasks' variant='bordered' size='sm' radius='full'>Back</Button>
      <Button onClick={copyLink} variant='bordered' size='sm' radius='full'>
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
      {/* ICS and Google Calendar actions removed as requested */}
    </div>
  );
}
