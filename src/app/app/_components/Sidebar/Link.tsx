import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className='hover:bg-content3 flex items-center gap-3 rounded-md p-2'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='w-9'>
        <Icon size={24} />
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
