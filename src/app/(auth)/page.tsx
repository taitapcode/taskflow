import createClient from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@heroui/button';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/app');

  return (
    <div className='z-10 flex flex-col items-center justify-center gap-4'>
      <h1 className='font-fascinate text-foreground text-9xl font-bold'>TaskFlow</h1>
      <h3 className='text-lg'>
        A task management app that helps you organize your tasks efficiently.
      </h3>
      <div className='flex gap-4'>
        <Button
          variant='bordered'
          size='lg'
          className='w-10 border-gray-300 hover:border-gray-100 hover:text-gray-100'
          radius='full'
          as={Link}
          href='/signup'
          disableRipple
        >
          Sign up
        </Button>
        <Button
          size='lg'
          className='w-10 bg-white text-black'
          as={Link}
          href='/login'
          radius='full'
          disableRipple
        >
          Log in
        </Button>
      </div>
    </div>
  );
}
