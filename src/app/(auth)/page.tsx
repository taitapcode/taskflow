import { Button, Chip, Card, CardBody } from '@/app/_components/UI';
import { LogIn, UserPlus, ListTodo, Zap, CalendarClock } from 'lucide-react';

export default function Home() {
  return (
    <div className='z-10 mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 py-10 text-center sm:py-14 md:py-16'>
      <Chip size='sm' color='primary' variant='flat'>
        Fast • Simple • Reliable
      </Chip>
      <h1 className='font-fascinate bg-gradient-to-b from-white to-white/70 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl md:text-8xl lg:text-9xl'>
        TaskFlow
      </h1>
      <p className='text-foreground-600 max-w-2xl text-base text-balance sm:text-lg'>
        Plan, track, and complete your work without the clutter. Clean views, fast interactions, and
        just the right features to keep momentum.
      </p>
      <div className='mt-2 flex flex-col items-center gap-3 sm:flex-row'>
        <Button color='primary' size='lg' radius='full' href='/signup' className='min-w-40'>
          <UserPlus size={18} /> Get started
        </Button>
        <Button variant='bordered' size='lg' radius='full' href='/login' className='min-w-40'>
          <LogIn size={18} /> Log in
        </Button>
      </div>
      <div className='mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4'>
        <Card shadow='sm' className='bg-content2/80 text-left'>
          <CardBody className='flex items-start gap-3'>
            <div className='bg-primary/15 text-primary mt-0.5 rounded-md p-2'>
              <ListTodo size={18} />
            </div>
            <div>
              <p className='font-medium'>Organize with ease</p>
              <p className='text-foreground-600 text-sm'>
                Spaces, statuses, priorities—simple and flexible.
              </p>
            </div>
          </CardBody>
        </Card>
        <Card shadow='sm' className='bg-content2/80 text-left'>
          <CardBody className='flex items-start gap-3'>
            <div className='bg-primary/15 text-primary mt-0.5 rounded-md p-2'>
              <Zap size={18} />
            </div>
            <div>
              <p className='font-medium'>Fast interactions</p>
              <p className='text-foreground-600 text-sm'>
                Snappy UI with clean, focused workflows.
              </p>
            </div>
          </CardBody>
        </Card>
        <Card shadow='sm' className='bg-content2/80 text-left'>
          <CardBody className='flex items-start gap-3'>
            <div className='bg-primary/15 text-primary mt-0.5 rounded-md p-2'>
              <CalendarClock size={18} />
            </div>
            <div>
              <p className='font-medium'>Stay on schedule</p>
              <p className='text-foreground-600 text-sm'>Deadlines and events at a glance.</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
