import { ShootingStars } from '@/components/ShootingStars';
import { StarsBackground } from '@/components/StarBackground';
import { Button } from '@heroui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <StarsBackground />
      <ShootingStars />
      <main className='flex flex-col items-center justify-center gap-4'>
        <h1 className='font-fascinate text-primary text-9xl font-bold'>TaskFlow</h1>
        <h3 className='text-lg'>
          A task management app that helps you organize your tasks efficiently.
        </h3>
        <div className='flex gap-4'>
          <Button
            variant='bordered'
            color='primary'
            size='lg'
            className='w-10'
            radius='full'
            as={Link}
            href='/signup'
            disableRipple
          >
            Sign up
          </Button>
          <Button
            color='primary'
            size='lg'
            className='w-10'
            as={Link}
            href='/login'
            radius='full'
            disableRipple
          >
            Log in
          </Button>
        </div>
      </main>
    </div>
  );
}
