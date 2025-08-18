import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';

type EventWithSpace = Tables<'Event'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return <main>Invalid event id</main>;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('Event')
    .select('id,Name,description,date,priority,created_at,space_id,Space(id,name)')
    .eq('id', id)
    .single<EventWithSpace>();

  if (error) return <main>Error loading event: {error.message}</main>;
  if (!data) return <main>Event not found</main>;

  const event = data;

  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header>
        <h1 className='text-2xl font-semibold'>{event.Name}</h1>
        <p className='text-foreground-500 mt-1 text-sm'>Space: {event.Space?.name ?? '—'}</p>
      </header>

      <div className='bg-content2 rounded-md border border-neutral-700'>
        <div className='p-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <p className='text-foreground-500 text-sm'>Date</p>
              <p className='font-medium'>{new Date(event.date).toLocaleString()}</p>
            </div>
            <div>
              <p className='text-foreground-500 text-sm'>Priority</p>
              <p className='font-medium capitalize'>{event.priority ?? 'none'}</p>
            </div>
            <div>
              <p className='text-foreground-500 text-sm'>Created</p>
              <p className='font-medium'>{new Date(event.created_at).toLocaleString()}</p>
            </div>
            <div className='sm:col-span-2'>
              <p className='text-foreground-500 text-sm'>Description</p>
              <p className='font-medium whitespace-pre-wrap'>{event.description ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
