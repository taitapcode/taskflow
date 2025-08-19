import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import SummaryCards from './_components/Dashboard/SummaryCards';
import RecentTasks from './_components/Dashboard/RecentTasks';
import UpcomingEvents from './_components/Dashboard/UpcomingEvents';
import { Card, CardBody, Button, Chip } from '@/app/_components/UI';
import { FolderPlus } from 'lucide-react';

export default async function AppPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return <main>Error: {userError.message}</main>;
  }

  // Get spaces for the current user
  const { data: spaces, error: spacesError } = await supabase
    .from('Space')
    .select('id')
    .eq('user_id', user?.id ?? '');

  if (spacesError) {
    return <main>Error loading spaces: {spacesError.message}</main>;
  }

  const spaceIds = (spaces ?? []).map((s) => s.id);

  // Fetch tasks and events scoped to user's spaces
  type TaskWithSpace = Tables<'Task'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };
  let tasks: TaskWithSpace[] = [];
  type EventWithSpace = Tables<'Event'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };
  let events: EventWithSpace[] = [];

  if (spaceIds.length > 0) {
    const [{ data: tasksData }, { data: eventsData }] = await Promise.all([
      supabase
        .from('Task')
        .select('id,name,deadline,description,priority,status,space_id,created_at,Space(id,name)')
        .in('space_id', spaceIds)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('Event')
        .select('id,Name,date,description,priority,space_id,created_at,Space(id,name)')
        .in('space_id', spaceIds)
        .order('date', { ascending: true })
        .limit(10),
    ]);

    tasks = (tasksData as any) ?? [];
    events = (eventsData as any) ?? [];
  }

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    (user?.email ? (user.email as string).split('@')[0] : undefined) ||
    'there';

  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>Welcome back, {displayName}</h1>
          <p className='text-foreground-500 mt-1 text-sm'>Here’s a quick snapshot of your work.</p>
        </div>
        <div className='flex items-center gap-2'>
          <Chip size='sm' variant='flat' color='primary'>
            {new Date().toLocaleDateString()}
          </Chip>
        </div>
      </header>

      <SummaryCards tasks={tasks} events={events} />

      {/* Quick action: Create Space */}
      <section className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        <Card shadow='sm' className='bg-content2 sm:col-span-1'>
          <CardBody className='flex items-center justify-between gap-3'>
            <div>
              <p className='font-medium'>Spaces</p>
              <p className='text-foreground-600 text-sm'>Organize tasks and events</p>
            </div>
            <Button href='/app/spaces' variant='bordered' size='sm' radius='full'>
              <FolderPlus size={18} /> Create
            </Button>
          </CardBody>
        </Card>
      </section>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <RecentTasks tasks={tasks} viewAllHref='/app/tasks' />
        </div>
        <div className='lg:col-span-1'>
          <UpcomingEvents events={events} viewAllHref='/app/events' />
        </div>
      </div>
    </main>
  );
}
