'use client';
import { Button } from '@heroui/react';
import createClient from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../_store/user';

export default function AccountPage() {
  const router = useRouter();
  const { logout } = useUserStore();

  async function handleLogOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) console.error('Error logging out:', error.message);
    logout();
    router.push('/');
  }

  return (
    <>
      <Button onPress={handleLogOut}>Logout</Button>
    </>
  );
}
