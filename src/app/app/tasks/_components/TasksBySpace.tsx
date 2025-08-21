"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip, Input, DropdownSelect, EmptyState } from '@/app/_components/UI';
import DataTable, { type Column } from '../../_components/DataTable';
import { formatDate } from '@/lib/date';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useDeferredValue, useCallback } from 'react';
import { taskPriorityColor, taskStatusColor } from '@/lib/uiColors';

type Space = Pick<Tables<'Space'>, 'id' | 'name'>;
type TaskWithSpace = Tables<'Task'> & { Space?: Space | null };

type Props = {
  spaces: Space[];
  tasks: TaskWithSpace[];
};

// Use centralized color helpers to avoid duplication and keep consistency

export default function TasksBySpace({ spaces, tasks }: Props) {
  const router = useRouter();

  // Local filters & sorting (no URL sync)
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [spaceFilter, setSpaceFilter] = useState<number | 'all'>('all');
  type TaskStatus = Tables<'Task'>['status'];
  const statusOptions = ['to-do', 'in-progress', 'done', 'overdue'] as const;
  const isTaskStatus = (v: string): v is TaskStatus =>
    (statusOptions as readonly string[]).includes(v);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  type TaskPriority = NonNullable<Tables<'Task'>['priority']>;
  const priorityOptions = ['low', 'medium', 'high', 'imidiate'] as const;
  const isTaskPriority = (v: string): v is TaskPriority =>
    (priorityOptions as readonly string[]).includes(v);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const sortOptions = [
    'created_desc',
    'created_asc',
    'deadline_asc',
    'deadline_desc',
    'priority_desc',
    'priority_asc',
  ] as const;
  type SortBy = (typeof sortOptions)[number];
  const isSortBy = (v: string): v is SortBy => (sortOptions as readonly string[]).includes(v);
  const [sortBy, setSortBy] = useState<SortBy>('created_desc');

  // Derived filtered + sorted tasks
  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const priorityRank: Record<string, number> = { low: 0, medium: 1, high: 2, imidiate: 3 };
    let rows = tasks.filter((t) => {
      if (spaceFilter !== 'all' && t.space_id !== spaceFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && (t.priority ?? 'none') !== priorityFilter) return false;
      if (!q) return true;
      const text = `${t.name} ${t.description ?? ''} ${t.Space?.name ?? ''}`.toLowerCase();
      return text.includes(q);
    });

    rows = rows.sort((a, b) => {
      switch (sortBy) {
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

    return rows;
  }, [tasks, deferredQuery, spaceFilter, statusFilter, priorityFilter, sortBy]);

  // Group by space after filtering
  const tasksBySpace = useMemo(() => {
    const map = new Map<number, TaskWithSpace[]>();
    for (const s of spaces) map.set(s.id, []);
    for (const t of filtered) {
      const list = map.get(t.space_id);
      if (list) list.push(t);
    }
    return map;
  }, [spaces, filtered]);

  const nonEmptySpaces = spaces.filter((s) => (tasksBySpace.get(s.id)?.length ?? 0) > 0);

  // Simple client-side pagination per space to cap DOM size
  const DEFAULT_VISIBLE = 50;
  const [visibleBySpace, setVisibleBySpace] = useState<Record<number, number>>({});
  const getVisible = useCallback((spaceId: number) => visibleBySpace[spaceId] ?? DEFAULT_VISIBLE, [visibleBySpace]);
  const showMore = useCallback((spaceId: number) => {
    setVisibleBySpace((prev) => ({ ...prev, [spaceId]: (prev[spaceId] ?? DEFAULT_VISIBLE) + DEFAULT_VISIBLE }));
  }, []);

  // Stable column definitions
  const columns: Column<TaskWithSpace>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        className: 'w-[40%] min-w-[220px] max-w-[420px] truncate',
        cell: (t) => <span className='truncate text-white'>{t.name}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        className: 'w-[12%] min-w-[120px]',
        cell: (t) => (
          <Chip size='sm' variant='solid' color={taskStatusColor(t.status)} className='capitalize'>
            {t.status}
          </Chip>
        ),
      },
      {
        key: 'priority',
        header: 'Priority',
        className: 'w-[12%] min-w-[120px]',
        cell: (t) => (
          <Chip size='sm' variant='solid' color={taskPriorityColor(t.priority)} className='capitalize'>
            {t.priority ?? 'none'}
          </Chip>
        ),
      },
      {
        key: 'deadline',
        header: 'Deadline',
        className: 'w-[18%] min-w-[140px]',
        cell: (t) => (t.deadline ? formatDate(t.deadline) : '—'),
      },
      {
        key: 'created',
        header: 'Created',
        className: 'w-[18%] min-w-[140px]',
        cell: (t) => formatDate(t.created_at),
      },
    ],
    [],
  );
  const hasAny = tasks.length > 0;

  if (!hasAny) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <EmptyState
          variant='tasks'
          title='No tasks yet'
          description='Your tasks across spaces will appear here.'
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
                placeholder='Search tasks, descriptions, or spaces'
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
                aria-label='Filter by status'
                value={statusFilter}
                onChange={(v) => setStatusFilter(isTaskStatus(v) ? v : 'all')}
                options={[
                  { label: 'All status', value: 'all' },
                  { label: 'To-do', value: 'to-do' },
                  { label: 'In-progress', value: 'in-progress' },
                  { label: 'Done', value: 'done' },
                  { label: 'Overdue', value: 'overdue' },
                ]}
                variant='flat'
                size='sm'
              />
              <DropdownSelect
                aria-label='Filter by priority'
                value={priorityFilter}
                onChange={(v) => setPriorityFilter(isTaskPriority(v) ? v : 'all')}
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
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-foreground-600 text-sm'>Sort</label>
              <DropdownSelect
                aria-label='Sort tasks'
                value={sortBy}
                onChange={(v) => setSortBy(isSortBy(v) ? v : 'created_desc')}
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
                className='w-48'
              />
            </div>
          </div>
        </CardBody>
      </Card>
      {nonEmptySpaces.map((space) => {
        const rows = tasksBySpace.get(space.id) ?? [];
        const visible = getVisible(space.id);
        const rowsSlice = rows.slice(0, visible);

        return (
          <Card key={space.id} shadow='sm' className='bg-content2 border border-neutral-700'>
            <CardBody className='p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-lg font-medium'>{space.name}</h2>
              </div>
              {/* Mobile – stacked list */}
              <ul className='flex flex-col gap-2 md:hidden'>
                {rowsSlice.length === 0 && (
                  <li className='text-foreground-500 text-sm'>No tasks in this space</li>
                )}
                {rowsSlice.map((t) => (
                  <li
                    key={t.id}
                    className='bg-content3/20 hover:bg-content3/40 rounded-md border border-neutral-800 p-3 transition-colors'
                    role='button'
                    tabIndex={0}
                    onClick={() => router.push(`/app/tasks/${t.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/app/tasks/${t.id}`);
                      }
                    }}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <p className='max-w-[70%] truncate font-medium text-white'>{t.name}</p>
                      <Chip
                        size='sm'
                        variant='solid'
                        color={taskStatusColor(t.status)}
                        className='shrink-0 capitalize'
                      >
                        {t.status}
                      </Chip>
                    </div>
                    <div className='mt-2 flex flex-wrap items-center gap-2 text-xs'>
                      <Chip
                        size='sm'
                        variant='solid'
                        color={taskPriorityColor(t.priority)}
                        className='capitalize'
                      >
                        {t.priority ?? 'none'}
                      </Chip>
                      <span className='text-foreground-500'>
                        {t.deadline ? formatDate(t.deadline) : 'No deadline'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Desktop – table */}
              <div className='hidden md:block'>
                <DataTable
                  ariaLabel={`Tasks in ${space.name}`}
                  data={rowsSlice}
                  columns={columns}
                  getKey={(t) => t.id}
                  emptyContent='No tasks in this space'
                  onRowClick={(t) => router.push(`/app/tasks/${t.id}`)}
                />
                {rows.length > rowsSlice.length && (
                  <div className='mt-2 flex justify-center'>
                    <button
                      className='text-primary text-sm underline-offset-2 hover:underline'
                      onClick={() => showMore(space.id)}
                    >
                      Load more ({rows.length - rowsSlice.length} more)
                    </button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
