import { useSidebarStore } from '../../_store/sidebar';
import { motion } from 'motion/react';
import logoImage from '@/public/logo.png';
import { CalendarDays, Folder, LayoutDashboard, ListTodo } from 'lucide-react';
import Link, { type SidebarLinkProps } from './Link';
import Image from 'next/image';
import User from './User';

const links: SidebarLinkProps[] = [
  {
    href: '/app',
    label: 'Daskboard',
    icon: LayoutDashboard,
  },
  {
    href: '/app/spaces',
    label: 'Spaces',
    icon: Folder,
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
  const { open, setClose, setOpen } = useSidebarStore();

  return (
    <motion.nav
      className='bg-content2 hidden h-full w-[70px] flex-col justify-between overflow-hidden p-3 select-none md:flex'
      animate={{ width: open ? '230px' : '70px' }}
      onMouseEnter={setOpen}
      onMouseLeave={setClose}
    >
      <div className='flex flex-col'>
        <div className='mb-6 flex items-center gap-3 pb-4'>
          <Image src={logoImage} alt='logo' width={45} height={45} />
          <motion.span
            animate={{ opacity: open ? 1 : 0 }}
            className='w-60 text-lg font-bold opacity-0'
          >
            TaskFlow
          </motion.span>
        </div>
        <div className='flex flex-col gap-2'>
          {links.map((link) => (
            <Link key={link.href} {...link} />
          ))}
        </div>
      </div>
      <User />
    </motion.nav>
  );
}
