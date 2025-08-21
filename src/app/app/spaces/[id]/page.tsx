import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import SpaceDetail from './_components/SpaceDetail';

type Space = Tables<'Space'>;
type Task = Pick<Tables<'Task'>, 'id' | 'name' | 'status' | 'priority' | 'deadline' | 'created_at'>;
type Event = Pick<Tables<'Event'>, 'id' | 'Name' | 'priority' | 'date' | 'created_at'>;

type Props = { params: Promise<{ id: string }> };

export default async function SpacePage({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) return <main>Invalid space id</main>;

  const supabase = await createClient();

  const [{ data: space, error: spaceError }, { data: tasks }, { data: events }] = await Promise.all([
    supabase
      .from('Space')
      .select('id,name,created_at,user_id')
      .eq('id', id)
      .single<Space>(),
    supabase
      .from('Task')
      .select('id,name,status,priority,deadline,created_at')
      .eq('space_id', id)
      .order('created_at', { ascending: false })
      .returns<Task[]>(),
    supabase
      .from('Event')
      .select('id,Name,priority,date,created_at')
      .eq('space_id', id)
      .order('date', { ascending: true })
      .returns<Event[]>(),
  ]);

  if (spaceError) return <main>Error loading space: {spaceError.message}</main>;
  if (!space) return <main>Space not found</main>;

  return (
    <main className='flex min-h-full flex-col gap-6'>
      <SpaceDetail space={space} tasks={tasks ?? []} events={events ?? []} />
    </main>
  );
}

