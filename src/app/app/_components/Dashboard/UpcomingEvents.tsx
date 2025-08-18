"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip } from '@heroui/react';
import Link from 'next/link';
import { colorForLabel } from '@/lib/color';

type EventWithSpace = Tables<'Event'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };
type Props = {
  events: EventWithSpace[];
};

export default function UpcomingEvents({ events }: Props) {
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
            <li key={e.id} className='flex items-start gap-3'>
              <div className='min-w-0 w-full'>
                <div className='flex items-center gap-2 min-w-0'>
                  <p className='font-medium truncate min-w-0 flex-1'>
                    <Link href={`/app/events/${e.id}`} className='text-white hover:underline underline-offset-4'>
                      {e.Name}
                    </Link>
                  </p>
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
