import { useSidebarStore } from '../../_store/sidebar';
import { useUserStore } from '../../_store/user';
import { motion } from 'motion/react';
import { LayoutDashboard, ListTodo } from 'lucide-react';
import Link, { type SidebarLinkProps } from './Link';

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
export default function DesktopSidebar() {
  const { open, setClose, setOpen } = useSidebarStore();
  const { user } = useUserStore();

  return (
    <motion.nav
      className='bg-content2 hidden h-full w-[70px] flex-col justify-between p-3 md:flex'
      animate={{ width: open ? '230px' : '70px' }}
      onMouseEnter={setOpen}
      onMouseLeave={setClose}
    >
      <div className='flex flex-col gap-5'>
        {links.map((link) => (
          <Link key={link.href} {...link} />
        ))}
      </div>
      <div className='border-t-1'></div>
    </motion.nav>
  );
}
