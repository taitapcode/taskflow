'use client';
import { useUserStore } from './_store/user';
import { useEffect } from 'react';
import createClient from '@/lib/supabase/browser';
import Sidebar from './_components/Sidebar';

export default function Layout({ children }: React.PropsWithChildren) {
  const { updateUser } = useUserStore();

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session?.user) updateUser(data.session.user);
    }

    fetchUser();
  }, [updateUser]);

  return (
    <div className='bg-content1 flex h-screen flex-1 flex-col overflow-hidden rounded-md border border-neutral-700 md:flex-row'>
      <Sidebar />
      <main className='w-full p-4'>{children}</main>
    </div>
  );
}
