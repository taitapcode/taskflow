'use client';
import type { Tables, TablesUpdate } from '@/lib/supabase/database.types';
import { Button, Card, CardBody, Chip, DropdownSelect, Input } from '@/app/_components/UI';
import { formatRelativeTime } from '@/lib/relative-time';
import { formatDate } from '@/lib/date';
import { eventPriorityColor, taskPriorityColor, taskStatusColor } from '@/lib/uiColors';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateTaskModal from './CreateTaskModal';
import CreateEventModal from './CreateEventModal';
import createClient from '@/lib/supabase/browser';

type Space = Tables<'Space'>;
type Task = Pick<Tables<'Task'>, 'id' | 'name' | 'status' | 'priority' | 'deadline' | 'created_at'>;
type Event = Pick<Tables<'Event'>, 'id' | 'Name' | 'priority' | 'date' | 'created_at' | 'overdue'>;

export default function SpaceDetail({
  space,
  tasks,
  events,
}: {
  space: Space;
  tasks: Task[];
  events: Event[];
}) {
  const [showTask, setShowTask] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const router = useRouter();
  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/app/spaces');
  }, [router]);

  // Edit Space (name/description)
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [spaceName, setSpaceName] = useState(space.name);
  const [spaceDescription, setSpaceDescription] = useState(space.description ?? '');
  const initial = useRef({ name: space.name, description: space.description ?? '' });
  const isDirty =
    spaceName.trim() !== initial.current.name ||
    (spaceDescription || '') !== (initial.current.description || '');

  async function saveSpace(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const n = spaceName.trim();
    if (!n) {
      setError('Space name is required');
      return;
    }
    if (!isDirty) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const patch: TablesUpdate<'Space'> = {};
    if (n !== space.name) patch.name = n;
    if ((spaceDescription || null) !== (space.description || null))
      patch.description = spaceDescription || null;
    const { error: upErr } = await supabase.from('Space').update(patch).eq('id', space.id);
    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    router.refresh();
  }

  // Tasks are always sorted by status (primary), with a secondary sort chosen by user
  const taskSortOptions = [
    'created_desc',
    'created_asc',
    'deadline_asc',
    'deadline_desc',
    'priority_desc',
    'priority_asc',
  ] as const;
  type TaskSortBy = (typeof taskSortOptions)[number];
  const isTaskSortBy = (v: string): v is TaskSortBy =>
    (taskSortOptions as readonly string[]).includes(v);
  const [taskSortBy, setTaskSortBy] = useState<TaskSortBy>('created_desc');

  const eventSortOptions = [
    'date_asc',
    'date_desc',
    'created_desc',
    'created_asc',
    'priority_desc',
    'priority_asc',
  ] as const;
  type EventSortBy = (typeof eventSortOptions)[number];
  const isEventSortBy = (v: string): v is EventSortBy =>
    (eventSortOptions as readonly string[]).includes(v);
  const [eventSortBy, setEventSortBy] = useState<EventSortBy>('date_asc');

  const tasksSorted = useMemo(() => {
    const statusRank: Record<string, number> = {
      overdue: 0,
      'in-progress': 1,
      'to-do': 2,
      done: 3,
    };
    const priorityRank: Record<string, number> = { low: 0, medium: 1, high: 2, imidiate: 3 };
    const arr = [...tasks];
    return arr.sort((a, b) => {
      const sa = statusRank[a.status] ?? 99;
      const sb = statusRank[b.status] ?? 99;
      if (sa !== sb) return sa - sb; // Always group by status first

      switch (taskSortBy) {
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'deadline_asc': {
          const ad = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
          const bd = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
          return ad - bd;
        }
        case 'deadline_desc': {
          const ad = a.deadline ? new Date(a.deadline).getTime() : Number.NEGATIVE_INFINITY;
          const bd = b.deadline ? new Date(b.deadline).getTime() : Number.NEGATIVE_INFINITY;
          return bd - ad;
        }
        case 'priority_desc':
          return (
            (priorityRank[b.priority ?? 'low'] ?? -1) - (priorityRank[a.priority ?? 'low'] ?? -1)
          );
        case 'priority_asc':
          return (
            (priorityRank[a.priority ?? 'low'] ?? -1) - (priorityRank[b.priority ?? 'low'] ?? -1)
          );
      }
    });
  }, [tasks, taskSortBy]);

  const eventsSorted = useMemo(() => {
    const rank: Record<string, number> = { low: 0, medium: 1, high: 2, imidiate: 3 };
    const arr = [...events];
    return arr.sort((a, b) => {
      switch (eventSortBy) {
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'priority_desc':
          return (rank[b.priority ?? 'low'] ?? -1) - (rank[a.priority ?? 'low'] ?? -1);
        case 'priority_asc':
          return (rank[a.priority ?? 'low'] ?? -1) - (rank[b.priority ?? 'low'] ?? -1);
      }
    });
  }, [events, eventSortBy]);
  return (
    <>
      <header className='flex items-start justify-between gap-4'>
        <div className='flex-1'>
          {!editing ? (
            <>
              <h1 className='text-2xl font-semibold'>{space.name}</h1>
              <p className='text-foreground-500 mt-1 text-sm'>
                Created {formatDate(space.created_at)}
                <span className='text-foreground-500'> • {formatRelativeTime(space.created_at)}</span>
              </p>
              {space.description && (
                <p className='text-foreground-500 mt-2 max-w-prose whitespace-pre-wrap text-sm'>
                  {space.description}
                </p>
              )}
            </>
          ) : (
            <form className='flex flex-col gap-3' onSubmit={saveSpace}>
              {error && (
                <div className='text-danger border-danger/40 bg-danger/10 rounded-md border p-2 text-sm'>
                  {error}
                </div>
              )}
              {!error && saved && (
                <div className='text-success border-success/40 bg-success/10 rounded-md border p-2 text-sm'>
                  Saved
                </div>
              )}
              <div className='max-w-xl'>
                <Input
                  label='Space name'
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  isDisabled={saving}
                  required
                />
              </div>
              <div className='max-w-2xl'>
                <label className='text-foreground-600 text-xs'>Description</label>
                <textarea
                  className='focus:ring-primary/60 mt-1 min-h-28 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2'
                  value={spaceDescription}
                  onChange={(e) => setSpaceDescription(e.target.value)}
                  disabled={saving}
                  placeholder='Describe this space'
                />
              </div>
              <div className='flex items-center gap-2'>
                <Button type='submit' isDisabled={saving || !spaceName.trim()} isLoading={saving} radius='full'>
                  Save
                </Button>
                <Button
                  type='button'
                  variant='bordered'
                  radius='full'
                  onClick={() => {
                    setSpaceName(initial.current.name);
                    setSpaceDescription(initial.current.description);
                    setEditing(false);
                  }}
                  isDisabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          {!editing ? (
            <>
              <Button onClick={() => setEditing(true)} variant='bordered' size='sm' radius='full'>
                Edit Space
              </Button>
              <Button onClick={goBack} variant='bordered' size='sm' radius='full'>
                Back to Spaces
              </Button>
            </>
          ) : (
            <Button onClick={goBack} variant='bordered' size='sm' radius='full'>
              Back to Spaces
            </Button>
          )}
        </div>
      </header>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Tasks */}
        <Card shadow='sm' className='bg-content2 border border-neutral-700'>
          <CardBody className='p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <h2 className='text-lg font-medium'>Tasks</h2>
              <div className='flex flex-nowrap items-center gap-2'>
                <Chip size='sm' variant='flat' className='shrink-0'>
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </Chip>
                <label className='text-foreground-600 hidden text-xs sm:block'>Sort</label>
                <DropdownSelect
                  aria-label='Sort tasks (within status)'
                  value={taskSortBy}
                  onChange={(v) => setTaskSortBy(isTaskSortBy(v) ? v : 'created_desc')}
                  options={[
                    { label: 'Newest', value: 'created_desc' },
                    { label: 'Oldest', value: 'created_asc' },
                    { label: 'Closest deadline', value: 'deadline_asc' },
                    { label: 'Farthest deadline', value: 'deadline_desc' },
                    { label: 'Priority: High → Low', value: 'priority_desc' },
                    { label: 'Priority: Low → High', value: 'priority_asc' },
                  ]}
                  variant='flat'
                  size='sm'
                  className='w-48 shrink-0'
                />
                <Button
                  variant='bordered'
                  size='sm'
                  radius='full'
                  className='shrink-0'
                  onClick={() => setShowTask(true)}
                >
                  New Task
                </Button>
              </div>
            </div>
            {tasks.length === 0 ? (
              <p className='text-foreground-500 text-sm'>No tasks in this space.</p>
            ) : (
              <ul className='divide-y divide-neutral-800'>
                {tasksSorted.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/app/tasks/${t.id}`}
                      className='hover:bg-content3/40 focus-visible:ring-primary/60 block rounded-md px-2 py-3 transition-colors focus:outline-none focus-visible:ring-2'
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>{t.name}</span>
                          <Chip
                            size='sm'
                            variant='solid'
                            color={taskStatusColor(t.status)}
                            className='capitalize'
                          >
                            {t.status}
                          </Chip>
                          <Chip
                            size='sm'
                            variant='flat'
                            color={taskPriorityColor(t.priority)}
                            className='capitalize'
                          >
                            {t.priority ?? 'none'}
                          </Chip>
                        </div>
                        <p className='text-foreground-600 mt-1 text-xs'>
                          Created {formatDate(t.created_at)}
                          <span> • {formatRelativeTime(t.created_at)}</span>
                          {t.deadline && (
                            <>
                              <span> • Deadline {formatDate(t.deadline)}</span>
                              <span className='text-foreground-500'>
                                {' '}
                                ({formatRelativeTime(t.deadline)})
                              </span>
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
              <div className='flex flex-nowrap items-center gap-2'>
                <Chip size='sm' variant='flat' className='shrink-0'>
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </Chip>
                <label className='text-foreground-600 hidden text-xs sm:block'>Sort</label>
                <DropdownSelect
                  aria-label='Sort events'
                  value={eventSortBy}
                  onChange={(v) => setEventSortBy(isEventSortBy(v) ? v : 'date_asc')}
                  options={[
                    { label: 'Date: Soonest', value: 'date_asc' },
                    { label: 'Date: Latest', value: 'date_desc' },
                    { label: 'Newest', value: 'created_desc' },
                    { label: 'Oldest', value: 'created_asc' },
                    { label: 'Priority: High → Low', value: 'priority_desc' },
                    { label: 'Priority: Low → High', value: 'priority_asc' },
                  ]}
                  variant='flat'
                  size='sm'
                  className='w-48 shrink-0'
                />
                <Button
                  variant='bordered'
                  size='sm'
                  radius='full'
                  className='shrink-0'
                  onClick={() => setShowEvent(true)}
                >
                  New Event
                </Button>
              </div>
            </div>
            {events.length === 0 ? (
              <p className='text-foreground-500 text-sm'>No events in this space.</p>
            ) : (
              <ul className='divide-y divide-neutral-800'>
                {eventsSorted.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/app/events/${e.id}`}
                      className='hover:bg-content3/40 focus-visible:ring-primary/60 block rounded-md px-2 py-3 transition-colors focus:outline-none focus-visible:ring-2'
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>{e.Name}</span>
                          <Chip
                            size='sm'
                            variant='flat'
                            color={eventPriorityColor(e.priority)}
                            className='capitalize'
                          >
                            {e.priority ?? 'none'}
                          </Chip>
                          {e.overdue && (
                            <Chip size='sm' variant='solid' color='danger'>
                              Overdue
                            </Chip>
                          )}
                        </div>
                        <p className='text-foreground-600 mt-1 text-xs'>
                          Scheduled {formatDate(e.date)}
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

      {/* Modals */}
      <CreateTaskModal open={showTask} spaceId={space.id} onClose={() => setShowTask(false)} />
      <CreateEventModal open={showEvent} spaceId={space.id} onClose={() => setShowEvent(false)} />
    </>
  );
}
