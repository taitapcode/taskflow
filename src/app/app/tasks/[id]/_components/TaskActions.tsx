'use client';
import { Button } from '@/app/_components/UI';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function TaskActions() {
  const pathname = usePathname();
  const router = useRouter();
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

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/app/tasks');
  }, [router]);

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Button onClick={goBack} variant='bordered' size='sm' radius='full'>
        Back
      </Button>
      <Button onClick={copyLink} variant='bordered' size='sm' radius='full'>
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );
}
