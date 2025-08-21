import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import EventsBySpace from './_components/EventsBySpace';
import CreateEventAction from './_components/CreateEventAction';
import { updateOverdueEventsForSpaces } from '@/lib/overdue';

type EventWithSpace = Tables<'Event'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };

export default async function EventsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) return <main>Error: {userError.message}</main>;

  const { data: spaces, error: spacesError } = await supabase
    .from('Space')
    .select('id,name')
    .eq('user_id', user?.id ?? '');
  if (spacesError) return <main>Error loading spaces: {spacesError.message}</main>;

  const spaceIds = (spaces ?? []).map((s) => s.id);

  let events: EventWithSpace[] = [];
  if (spaceIds.length > 0) {
    // Auto-mark overdue events before fetching
    await updateOverdueEventsForSpaces(supabase, spaceIds);
    const { data: eventsData, error: eventsError } = await supabase
      .from('Event')
      .select('id,Name,date,description,priority,overdue,space_id,created_at,Space(id,name)')
      .in('space_id', spaceIds)
      .order('date', { ascending: true });
    if (eventsError) return <main>Error loading events: {eventsError.message}</main>;
    events = (eventsData as unknown as EventWithSpace[]) ?? [];
  }

  return (
    <main className='flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden'>
      <header className='shrink-0'>
        <div>
          <h1 className='text-2xl font-semibold'>Events</h1>
          <p className='text-foreground-500 mt-1 text-sm'>All events across your spaces</p>
        </div>
      </header>
      <div className='shrink-0'>
        <CreateEventAction spaces={spaces ?? []} />
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto pb-20 md:pb-0 scrollbar-hide'>
        <EventsBySpace spaces={spaces ?? []} events={events} />
      </div>
    </main>
  );
}
