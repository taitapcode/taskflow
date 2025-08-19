'use client';
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip, Input, DropdownSelect, EmptyState } from '@/app/_components/UI';
import DataTable, { type Column } from '../../_components/DataTable';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Space = Pick<Tables<'Space'>, 'id' | 'name'>;
type EventWithSpace = Tables<'Event'> & { Space?: Space | null };

type Props = {
  spaces: Space[];
  events: EventWithSpace[];
};

function priorityColor(priority: Tables<'Event'>['priority'] | null | undefined) {
  switch (priority) {
    case 'low':
      return 'default' as const;
    case 'medium':
      return 'primary' as const;
    case 'high':
      return 'warning' as const;
    case 'imidiate':
      return 'danger' as const;
    default:
      return 'default' as const;
  }
}

export default function EventsBySpace({ spaces, events }: Props) {
  const router = useRouter();

  // Local filters (no URL sync)
  const [query, setQuery] = useState('');
  const [spaceFilter, setSpaceFilter] = useState<number | 'all'>('all');
  type EventPriority = NonNullable<Tables<'Event'>['priority']>;
  const eventPriorities = ['low', 'medium', 'high', 'imidiate'] as const;
  const isEventPriority = (v: string): v is EventPriority =>
    (eventPriorities as readonly string[]).includes(v);
  const [priorityFilter, setPriorityFilter] = useState<EventPriority | 'all'>('all');
  const [hidePast, setHidePast] = useState(true);
  const sortOptions = ['date_asc', 'date_desc', 'created_desc', 'created_asc'] as const;
  type SortBy = (typeof sortOptions)[number];
  const isSortBy = (v: string): v is SortBy => (sortOptions as readonly string[]).includes(v);
  const [sortBy, setSortBy] = useState<SortBy>('date_asc');

  // Removed loading spinner; keep instant filter updates.

  // Derived filtered + sorted events
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = events.filter((e) => {
      if (spaceFilter !== 'all' && e.space_id !== spaceFilter) return false;
      if (priorityFilter !== 'all' && (e.priority ?? 'none') !== priorityFilter) return false;
      if (hidePast && new Date(e.date) < new Date()) return false;
      if (!q) return true;
      const text = `${e.Name} ${e.description ?? ''} ${e.Space?.name ?? ''}`.toLowerCase();
      return text.includes(q);
    });

    rows = rows.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return rows;
  }, [events, query, spaceFilter, priorityFilter, hidePast, sortBy]);

  // Group by space after filtering
  const eventsBySpace = useMemo(() => {
    const map = new Map<number, EventWithSpace[]>();
    for (const s of spaces) map.set(s.id, []);
    for (const e of filtered) {
      const list = map.get(e.space_id);
      if (list) list.push(e);
    }
    return map;
  }, [spaces, filtered]);

  const nonEmptySpaces = spaces.filter((s) => (eventsBySpace.get(s.id)?.length ?? 0) > 0);
  const hasAny = events.length > 0;

  if (!hasAny) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <EmptyState
          variant='events'
          title='No events yet'
          description='Events from your spaces will appear here.'
          actionHref='/app'
          actionLabel='Back to Dashboard'
        />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Filters toolbar */}
      <Card shadow='sm' className='bg-content2 border border-neutral-700'>
        <CardBody className='p-4'>
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-1 items-center gap-3'>
              <Input
                placeholder='Search events, descriptions, or spaces'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='w-full md:max-w-xs'
              />
              <DropdownSelect
                aria-label='Filter by space'
                value={spaceFilter === 'all' ? 'all' : String(spaceFilter)}
                onChange={(v) => setSpaceFilter(v === 'all' ? 'all' : Number(v))}
                options={[
                  { label: 'All spaces', value: 'all' },
                  ...spaces.map((s) => ({ label: s.name, value: String(s.id) })),
                ]}
                variant='flat'
                size='sm'
              />
              <DropdownSelect
                aria-label='Filter by priority'
                value={priorityFilter}
                onChange={(v) => setPriorityFilter(isEventPriority(v) ? v : 'all')}
                options={[
                  { label: 'All priority', value: 'all' },
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                  { label: 'Imidiate', value: 'imidiate' },
                ]}
                variant='flat'
                size='sm'
              />
              <label className='text-foreground-600 flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  className='accent-primary'
                  checked={hidePast}
                  onChange={(e) => setHidePast(e.target.checked)}
                />
                Hide past
              </label>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-foreground-600 text-sm'>Sort</label>
              <DropdownSelect
                aria-label='Sort events'
                value={sortBy}
                onChange={(v) => setSortBy(isSortBy(v) ? v : 'date_asc')}
                options={[
                  { label: 'Date: Soonest', value: 'date_asc' },
                  { label: 'Date: Latest', value: 'date_desc' },
                  { label: 'Newest', value: 'created_desc' },
                  { label: 'Oldest', value: 'created_asc' },
                ]}
                variant='flat'
                size='sm'
              />
            </div>
          </div>
        </CardBody>
      </Card>
      {nonEmptySpaces.map((space) => {
        const rows = eventsBySpace.get(space.id) ?? [];
        const columns: Column<EventWithSpace>[] = [
          {
            key: 'name',
            header: 'Name',
            className: 'w-[40%] min-w-[220px] max-w-[420px] truncate',
            cell: (e) => <span className='truncate text-white'>{e.Name}</span>,
          },
          {
            key: 'date',
            header: 'Date',
            className: 'w-[18%] min-w-[140px]',
            cell: (e) => new Date(e.date).toLocaleDateString(),
          },
          {
            key: 'priority',
            header: 'Priority',
            className: 'w-[12%] min-w-[120px]',
            cell: (e) => (
              <Chip
                size='sm'
                variant='solid'
                color={priorityColor(e.priority)}
                className='capitalize'
              >
                {e.priority ?? 'none'}
              </Chip>
            ),
          },
          {
            key: 'created',
            header: 'Created',
            className: 'w-[18%] min-w-[140px]',
            cell: (e) => new Date(e.created_at).toLocaleDateString(),
          },
        ];

        return (
          <Card key={space.id} shadow='sm' className='bg-content2 border border-neutral-700'>
            <CardBody className='p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-lg font-medium'>{space.name}</h2>
              </div>
              {/* Mobile – stacked list */}
              <ul className='flex flex-col gap-2 md:hidden'>
                {rows.length === 0 && (
                  <li className='text-foreground-500 text-sm'>No events in this space</li>
                )}
                {rows.map((e) => (
                  <li
                    key={e.id}
                    className='bg-content3/20 hover:bg-content3/40 rounded-md border border-neutral-800 p-3 transition-colors'
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
                    <div className='flex items-start justify-between gap-2'>
                      <p className='max-w-[70%] truncate font-medium text-white'>{e.Name}</p>
                      <Chip
                        size='sm'
                        variant='solid'
                        color={priorityColor(e.priority)}
                        className='shrink-0 capitalize'
                      >
                        {e.priority ?? 'none'}
                      </Chip>
                    </div>
                    <div className='mt-2 flex flex-wrap items-center gap-2 text-xs'>
                      <span className='text-foreground-500'>
                        {new Date(e.date).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Desktop – table */}
              <div className='hidden md:block'>
                <DataTable
                  ariaLabel={`Events in ${space.name}`}
                  data={rows}
                  columns={columns}
                  getKey={(e) => e.id}
                  emptyContent='No events in this space'
                  onRowClick={(e) => router.push(`/app/events/${e.id}`)}
                />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
