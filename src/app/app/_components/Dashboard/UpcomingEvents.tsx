'use client';
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip } from '@/app/_components/UI';
import { colorForLabel } from '@/lib/color';
import { useRouter } from 'next/navigation';

type EventWithSpace = Tables<'Event'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };
type Props = {
  events: EventWithSpace[];
};

export default function UpcomingEvents({ events, viewAllHref }: Props & { viewAllHref?: string }) {
  const router = useRouter();
  const upcoming = events.filter((e) => new Date(e.date) >= new Date()).slice(0, 8);

  return (
    <Card shadow='sm' className='bg-content2 border border-neutral-700'>
      <CardBody className='p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-lg font-medium'>Upcoming Events</h2>
          {viewAllHref && (
            <a href={viewAllHref} className='text-primary text-sm hover:underline'>
              View all
            </a>
          )}
        </div>
        <ul className='flex flex-col gap-3'>
          {upcoming.length === 0 && (
            <li className='text-foreground-500 text-sm'>No upcoming events</li>
          )}
          {upcoming.map((e) => (
            <li
              key={e.id}
              className='hover:bg-content3/30 -mx-2 flex cursor-pointer items-start gap-3 rounded-md px-2 py-2'
              role='button'
              tabIndex={0}
              onClick={() => router.push(`/app/events/${e.id}`)}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter' || evt.key === ' ') {
                  evt.preventDefault();
                  router.push(`/app/events/${e.id}`);
                }
              }}
            >
              <div className='w-full min-w-0'>
                <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                  <p className='min-w-0 flex-1 truncate font-medium text-white'>{e.Name}</p>
                  <div className='flex shrink-0 items-center gap-2 sm:ml-2'>
                    <span className='text-foreground-500 text-xs'>
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                    {e.Space?.name ? (
                      <Chip
                        size='sm'
                        variant='solid'
                        className={`${colorForLabel(e.Space.name).bg} ${colorForLabel(e.Space.name).text} border-transparent`}
                      >
                        {e.Space.name}
                      </Chip>
                    ) : (
                      <Chip size='sm' variant='flat' className='text-foreground-500'>
                        —
                      </Chip>
                    )}
                  </div>
                </div>
                {e.description && (
                  <p className='text-foreground-500 mt-1 line-clamp-2 text-sm'>{e.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
