import createClient from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShootingStars } from './_components/ShootingStars';
import { StarsBackground } from './_components/StarBackground';

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
    <div className='flex h-screen items-center justify-center'>
      <StarsBackground />
      <ShootingStars starHeight={3} starColor='#fff' />
      <main className='z-10'>{children}</main>
    </div>
  );
}
