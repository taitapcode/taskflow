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
    const active = href === '/app'
      ? pathname === '/app'
      : pathname === href || pathname.startsWith(href + '/');
    setIsActive(active);
  }, [pathname, href]);

  return (
    <Link
      href={href}
      title={label}
      className={cn(
        'relative flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors',
        isActive ? 'bg-content4' : 'hover:bg-content3',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Active indicator */}
      <motion.span
        layout
        className='absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary'
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
      <div className='grid h-9 w-9 flex-none place-items-center'>
        <Icon
          size={22}
          className={cn('leading-none', isActive ? 'text-primary' : 'text-foreground')}
        />
      </div>
      <motion.span
        animate={{
          x: open ? (isHovered ? 10 : 0) : 20,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
        className={cn(
          'text-md w-60 overflow-hidden text-lg whitespace-nowrap',
          isActive ? 'text-foreground' : 'text-foreground-600',
        )}
      >
        {label}
      </motion.span>
    </Link>
  );
}
