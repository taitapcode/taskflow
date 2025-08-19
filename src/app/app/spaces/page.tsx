import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import ManageSpaces from './_components/ManageSpaces';

type Space = Pick<Tables<'Space'>, 'id' | 'name' | 'created_at'>;

export default async function SpacesPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) return <main>Error: {userError.message}</main>;

  const { data, error } = await supabase
    .from('Space')
    .select('id,name,created_at')
    .eq('user_id', user?.id ?? '')
    .order('created_at', { ascending: false });
  if (error) return <main>Error loading spaces: {error.message}</main>;

  const spaces = (data as Space[]) ?? [];

  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header className='flex items-end justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>Spaces</h1>
          <p className='text-foreground-500 mt-1 text-sm'>Create and manage your spaces</p>
        </div>
      </header>

      <ManageSpaces initial={spaces} />
    </main>
  );
}
