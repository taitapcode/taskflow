import createClient from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/app');

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(60%_80%_at_50%_-10%,rgba(255,255,255,0.08),transparent_70%)] px-4'>
      <main className='flex w-full max-w-5xl items-center justify-center'>{children}</main>
    </div>
  );
}
