import { useSidebarStore } from '../../_store/sidebar';
import { motion, useReducedMotion } from 'motion/react';
import logoImage from '@/public/logo.png';
import { CalendarDays, LayoutDashboard, ListTodo, FolderPlus } from 'lucide-react';
import Link, { type SidebarLinkProps } from './DesktopLink';
import Image from 'next/image';
import User from './User';

export const links: SidebarLinkProps[] = [
  {
    href: '/app',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/app/spaces',
    label: 'Spaces',
    icon: FolderPlus,
  },
  {
    href: '/app/tasks',
    label: 'Tasks',
    icon: ListTodo,
  },
  {
    href: '/app/events',
    label: 'Events',
    icon: CalendarDays,
  },
];
export default function DesktopSidebar() {
  const prefersReducedMotion = useReducedMotion();
  const { open, setClose, setOpen } = useSidebarStore();

  return (
    <motion.nav
      className='bg-content2/80 hidden h-full w-[80px] flex-col justify-between overflow-hidden border-r border-neutral-800 p-3 backdrop-blur select-none md:flex'
      animate={prefersReducedMotion ? undefined : { width: open ? '230px' : '80px' }}
      onMouseEnter={setOpen}
      onMouseLeave={setClose}
    >
      <div className='flex flex-col'>
        <div className='mb-6 flex items-center gap-3 pb-4'>
          <Image src={logoImage} alt='logo' width={45} height={45} />
          <motion.span
            animate={prefersReducedMotion ? undefined : { opacity: open ? 1 : 0 }}
            className='w-60 text-lg font-bold opacity-0'
          >
            TaskFlow
          </motion.span>
        </div>
        <div className='flex flex-col gap-1.5'>
          {links.map((link) => (
            <Link key={link.href} {...link} />
          ))}
        </div>
      </div>
      <User />
    </motion.nav>
  );
}
