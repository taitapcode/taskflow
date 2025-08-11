import { useState } from 'react';
import { useUserStore } from '../../_store/user';
import { useSidebarStore } from '../../_store/sidebar';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Avatar } from '@heroui/react';

export default function User() {
  const { user } = useUserStore();
  const { open } = useSidebarStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      className='hover:bg-content3 relative flex cursor-pointer items-center gap-3 overflow-x-hidden rounded-md p-1'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      href='/app/account'
    >
      <div className='w-9'>
        <Avatar showFallback={!!user?.avatarUrl} src={user?.avatarUrl} />
      </div>
      <motion.span
        animate={{
          opacity: open ? 1 : 0,
          x: open ? (isHovered ? 10 : 0) : 20,
        }}
        className='w-60 overflow-hidden text-lg whitespace-nowrap'
      >
        {user?.displayName}
      </motion.span>
    </Link>
  );
}
