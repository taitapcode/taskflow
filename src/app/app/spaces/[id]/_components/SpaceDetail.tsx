'use client';
import type { Tables } from '@/lib/supabase/database.types';
import { Button, Card, CardBody, Chip } from '@/app/_components/UI';
import { formatRelativeTime } from '@/lib/relative-time';
import { eventPriorityColor, taskPriorityColor, taskStatusColor } from '@/lib/uiColors';
import Link from 'next/link';

type Space = Tables<'Space'>;
type Task = Pick<Tables<'Task'>, 'id' | 'name' | 'status' | 'priority' | 'deadline' | 'created_at'>;
type Event = Pick<Tables<'Event'>, 'id' | 'Name' | 'priority' | 'date' | 'created_at'>;

export default function SpaceDetail({
  space,
  tasks,
  events,
}: {
  space: Space;
  tasks: Task[];
  events: Event[];
}) {
  return (
    <>
      <header className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>{space.name}</h1>
          <p className='text-foreground-500 mt-1 text-sm'>
            Created {new Date(space.created_at).toLocaleString()}
            <span className='text-foreground-500'> • {formatRelativeTime(space.created_at)}</span>
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button href='/app/spaces' variant='bordered' size='sm' radius='full'>
            Back to Spaces
          </Button>
        </div>
      </header>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Tasks */}
        <Card shadow='sm' className='bg-content2 border border-neutral-700'>
          <CardBody className='p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <h2 className='text-lg font-medium'>Tasks</h2>
              <Chip size='sm' variant='flat'>
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </Chip>
            </div>
            {tasks.length === 0 ? (
              <p className='text-foreground-500 text-sm'>No tasks in this space.</p>
            ) : (
              <ul className='divide-y divide-neutral-800'>
                {tasks.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/app/tasks/${t.id}`}
                      className='block rounded-md px-2 py-3 transition-colors hover:bg-content3/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60'
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>{t.name}</span>
                          <Chip size='sm' variant='solid' color={taskStatusColor(t.status)} className='capitalize'>
                            {t.status}
                          </Chip>
                          <Chip size='sm' variant='flat' color={taskPriorityColor(t.priority)} className='capitalize'>
                            {t.priority ?? 'none'}
                          </Chip>
                        </div>
                        <p className='text-foreground-600 mt-1 text-xs'>
                          Created {new Date(t.created_at).toLocaleString()}
                          <span> • {formatRelativeTime(t.created_at)}</span>
                          {t.deadline && (
                            <>
                              <span> • Deadline {new Date(t.deadline).toLocaleString()}</span>
                              <span className='text-foreground-500'> ({formatRelativeTime(t.deadline)})</span>
                            </>
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Events */}
        <Card shadow='sm' className='bg-content2 border border-neutral-700'>
          <CardBody className='p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <h2 className='text-lg font-medium'>Events</h2>
              <Chip size='sm' variant='flat'>
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </Chip>
            </div>
            {events.length === 0 ? (
              <p className='text-foreground-500 text-sm'>No events in this space.</p>
            ) : (
              <ul className='divide-y divide-neutral-800'>
                {events.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/app/events/${e.id}`}
                      className='block rounded-md px-2 py-3 transition-colors hover:bg-content3/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60'
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>{e.Name}</span>
                          <Chip size='sm' variant='flat' color={eventPriorityColor(e.priority)} className='capitalize'>
                            {e.priority ?? 'none'}
                          </Chip>
                        </div>
                        <p className='text-foreground-600 mt-1 text-xs'>
                          Scheduled {new Date(e.date).toLocaleString()}
                          <span> • {formatRelativeTime(e.date)}</span>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
