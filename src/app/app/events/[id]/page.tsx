import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import EventDetail from './_components/EventDetail';
import { updateOverdueEventById } from '@/lib/overdue';

type EventWithSpace = Tables<'Event'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) return <main>Invalid event id</main>;

  const supabase = await createClient();
  // Auto-mark as overdue if needed before fetching
  await updateOverdueEventById(supabase, id);
  const { data, error } = await supabase
    .from('Event')
    .select('id,Name,description,date,priority,overdue,created_at,space_id,Space(id,name)')
    .eq('id', id)
    .single<EventWithSpace>();

  if (error) return <main>Error loading event: {error.message}</main>;
  if (!data) return <main>Event not found</main>;

  const event = data;

  return (
    <main className='flex min-h-full flex-col gap-6'>
      <EventDetail event={event} />
    </main>
  );
}
