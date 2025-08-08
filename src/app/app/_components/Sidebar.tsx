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
    <Link
      href={href}
      className='hover:bg-content3 flex items-center gap-4 rounded-md p-2 hover:[&>span]:translate-x-2.5'
    >
      <div className='w-9'>
        <Icon size={40} />
      </div>
      <motion.span
        animate={{
          x: open ? 0 : 20,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
        className='overflow-hidden text-xl font-semibold whitespace-nowrap transition-transform'
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
      className='bg-content2 hidden h-full w-[80px] flex-col justify-between p-3 md:flex'
      animate={{ width: open ? '280px' : '80px' }}
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
