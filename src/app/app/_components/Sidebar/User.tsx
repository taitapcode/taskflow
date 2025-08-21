import { useState } from 'react';
import { useUserStore } from '../../_store/user';
import { useSidebarStore } from '../../_store/sidebar';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import Avatar from '@/app/_components/UI/Avatar';

export default function User() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useUserStore();
  const { open } = useSidebarStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      className='hover:bg-content3 relative flex cursor-pointer items-center gap-3 overflow-x-hidden rounded-md p-2'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      href='/app/account'
    >
      <div className='min-h-9 min-w-9 flex-none'>
        <Avatar src={user?.avatarUrl ?? undefined} size={36} />
      </div>
      <motion.span
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: open ? 1 : 0, x: open ? (isHovered ? 10 : 0) : 20 }
        }
        className='w-60 overflow-hidden text-lg whitespace-nowrap'
      >
        {user?.displayName ?? 'Account'}
      </motion.span>
    </Link>
  );
}
