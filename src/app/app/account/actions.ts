'use server';
import createClient from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function logOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error logging out:', error);
  redirect('/');
}
