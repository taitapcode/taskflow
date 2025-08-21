'use client';
import { Button } from '@/app/_components/UI';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function EventActions() {
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
      <Button href='/app/events' variant='bordered' size='sm' radius='full'>
        Back
      </Button>
      <Button onClick={copyLink} variant='bordered' size='sm' radius='full'>
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
      {/* ICS and Google Calendar actions removed as requested */}
    </div>
  );
}
