"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip } from '@heroui/react';
import { colorForLabel } from '@/lib/color';
import { useRouter } from 'next/navigation';

type EventWithSpace = Tables<'Event'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };
type Props = {
  events: EventWithSpace[];
};

export default function UpcomingEvents({ events }: Props) {
  const router = useRouter();
  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 8);

  return (
    <Card shadow='sm' className='bg-content2 border border-neutral-700'>
      <CardBody className='p-4'>
        <h2 className='mb-3 text-lg font-medium'>Upcoming Events</h2>
        <ul className='flex flex-col gap-3'>
          {upcoming.length === 0 && (
            <li className='text-foreground-500 text-sm'>No upcoming events</li>
          )}
          {upcoming.map((e) => (
            <li
              key={e.id}
              className='flex items-start gap-3 rounded-md px-2 py-2 -mx-2 cursor-pointer hover:bg-content3/30'
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
              <div className='min-w-0 w-full'>
                <div className='flex items-center gap-2 min-w-0'>
                  <p className='font-medium truncate min-w-0 flex-1 text-white'>{e.Name}</p>
                  <div className='ml-2 flex items-center gap-2 shrink-0'>
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
                      <Chip size='sm' variant='flat' className='text-foreground-500'>—</Chip>
                    )}
                  </div>
                </div>
                {e.description && (
                  <p className='text-foreground-500 mt-1 text-sm line-clamp-2'>{e.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
