import createClient from '@/lib/supabase/server';

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Log user to check authentication
  console.log('Current user:', user);

  // Note: Make sure 'Space' is the correct table name (case sensitive)
  const { data, error } = await supabase.from('Task').select('*');

  if (error) {
    console.error('Supabase error:', error);
    return <main>Error loading data: {error.message}</main>;
  }

  return (
    <main>
      <pre>
        {/* User: {JSON.stringify(user, null, 2)} */}
        Data: {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
