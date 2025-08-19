import { Button } from '@/app/_components/UI';

export default function Home() {
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
          className='min-w-12 border-gray-300 hover:border-gray-100 hover:text-gray-100'
          radius='full'
          href='/signup'
        >
          Sign up
        </Button>
        <Button size='lg' className='min-w-12 bg-white text-black' href='/login' radius='full'>
          Log in
        </Button>
      </div>
    </div>
  );
}
