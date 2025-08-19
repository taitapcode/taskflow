"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { links } from './Desktop';

export default function MobileSidebar() {
  const pathname = usePathname();
  return (
    <nav className='md:hidden fixed bottom-3 left-1/2 z-40 w-[92%] max-w-xl -translate-x-1/2 rounded-2xl border border-neutral-800 bg-content2/80 px-2 py-1.5 backdrop-blur'>
      <ul className='flex items-center justify-around'>
        {links.map((l) => {
          const active = l.href === '/app'
            ? pathname === '/app'
            : pathname === l.href || pathname.startsWith(l.href + '/');
          const Icon = l.icon;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className='flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs'
              >
                <Icon size={22} className={active ? 'text-primary' : 'text-foreground'} />
                <span className={active ? 'text-foreground' : 'text-foreground-600'}>
                  {l.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
