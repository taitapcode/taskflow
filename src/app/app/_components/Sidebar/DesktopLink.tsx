import type { LucideIcon } from 'lucide-react';
import cn from '@/lib/cn';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '../../_store/sidebar';
import { motion } from 'motion/react';
import Link from 'next/link';

export type SidebarLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export default function SidebarLink({ href, label, icon: Icon }: SidebarLinkProps) {
  const { open } = useSidebarStore();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if the current route matches the link's href
    setIsActive(pathname === href);
  }, [pathname, href]);

  return (
    <Link
      href={href}
      className={cn(
        'hover:bg-content3 flex items-center gap-3 rounded-md px-2 py-1.5',
        isActive && '!bg-content4',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='grid h-9 w-9 flex-none place-items-center'>
        <Icon size={24} className='leading-none' />
      </div>
      <motion.span
        animate={{
          x: open ? (isHovered ? 10 : 0) : 20,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
        className='text-md w-60 overflow-hidden text-lg whitespace-nowrap'
      >
        {label}
      </motion.span>
    </Link>
  );
}
