'use client';
import { Button } from '@heroui/react';
import createClient from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();

  async function handleLogOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) console.error('Error logging out:', error.message);
    router.push('/');
  }

  return (
    <>
      <Button onPress={handleLogOut}>Logout</Button>
    </>
  );
}
