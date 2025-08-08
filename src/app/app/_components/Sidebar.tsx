'use client';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useSidebarStore } from '../_store/sidebar';
import Link from 'next/link';
import { LayoutDashboard, ListTodo } from 'lucide-react';

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

function SidebarLink({ href, label, icon: Icon }: SidebarLinkProps) {
  const { open } = useSidebarStore();

  return (
    <Link href={href} className='flex gap-2'>
      <div className='w-8'>
        <Icon size={30} />
      </div>
      <motion.span
        animate={{
          x: open ? '0' : '-20px',
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
        className='text-lg font-medium whitespace-nowrap'
      >
        {label}
      </motion.span>
    </Link>
  );
}

const links: SidebarLinkProps[] = [
  {
    href: '/app',
    label: 'Daskboard',
    icon: LayoutDashboard,
  },
  {
    href: '/app/tasks',
    label: 'Tasks',
    icon: ListTodo,
  },
];

function DesktopSidebar() {
  const { open, setClose, setOpen } = useSidebarStore();

  return (
    <motion.nav
      className='bg-content1 flex h-full w-[75px] flex-col justify-between p-5'
      animate={{ width: open ? '280px' : '75px' }}
      onMouseEnter={setOpen}
      onMouseLeave={setClose}
    >
      <div className='flex flex-col gap-5'>
        {links.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
    </motion.nav>
  );
}

function MobileSidebar() {
  return <></>;
}

export default function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
