'use client';
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip } from '@/app/_components/UI';
import { colorForLabel } from '@/lib/color';
import { taskPriorityColor, taskStatusColor } from '@/lib/uiColors';
import DataTable, { type Column } from '../DataTable';
import { useRouter } from 'next/navigation';

type TaskWithSpace = Tables<'Task'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };
type Props = { tasks: TaskWithSpace[] };

export default function RecentTasks({ tasks, viewAllHref }: Props & { viewAllHref?: string }) {
  const router = useRouter();
  const columns: Column<TaskWithSpace>[] = [
    {
      key: 'name',
      header: 'Name',
      className: 'w-[40%] min-w-[200px] max-w-[360px] truncate',
      cell: (t) => <span className='truncate text-white'>{t.name}</span>,
    },
    {
      key: 'space',
      header: 'Space',
      className: 'w-[20%] min-w-[140px] max-w-[200px] truncate',
      cell: (t) =>
        t.Space?.name ? (
          <Chip
            size='sm'
            variant='solid'
            className={`${colorForLabel(t.Space.name).bg} ${colorForLabel(t.Space.name).text} border-transparent`}
          >
            {t.Space.name}
          </Chip>
        ) : (
          '—'
        ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-[14%] min-w-[120px]',
      cell: (t) => (
        <Chip size='sm' variant='solid' color={taskStatusColor(t.status)} className='capitalize'>
          {t.status}
        </Chip>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      className: 'w-[14%] min-w-[120px]',
      cell: (t) => (
        <Chip size='sm' variant='solid' color={taskPriorityColor(t.priority)} className='capitalize'>
          {t.priority ?? 'none'}
        </Chip>
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      className: 'w-[12%] min-w-[120px]',
      cell: (t) => (t.deadline ? new Date(t.deadline).toLocaleDateString() : '—'),
    },
  ];

  return (
    <Card shadow='sm' className='bg-content2 border border-neutral-700'>
      <CardBody className='p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-lg font-medium'>Recent Tasks</h2>
          {viewAllHref && (
            <a href={viewAllHref} className='text-primary text-sm hover:underline'>
              View all
            </a>
          )}
        </div>
        {/* Mobile – stacked list */}
        <ul className='flex flex-col gap-2 md:hidden'>
          {tasks.slice(0, 10).length === 0 && (
            <li className='text-foreground-500 text-sm'>No tasks found</li>
          )}
          {tasks.slice(0, 10).map((t) => (
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
                {t.Space?.name ? (
                  <Chip
                    size='sm'
                    variant='solid'
                    className={`${colorForLabel(t.Space.name).bg} ${colorForLabel(t.Space.name).text} border-transparent`}
                  >
                    {t.Space.name}
                  </Chip>
                ) : (
                  <Chip size='sm' variant='flat' className='text-foreground-500'>
                    —
                  </Chip>
                )}
                <Chip
                  size='sm'
                  variant='solid'
                  color={taskPriorityColor(t.priority)}
                  className='capitalize'
                >
                  {t.priority ?? 'none'}
                </Chip>
                <span className='text-foreground-500'>
                  {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop – table */}
        <div className='hidden md:block'>
          <DataTable
            ariaLabel='Recent tasks table'
            data={tasks.slice(0, 10)}
            columns={columns}
            getKey={(t) => t.id}
            emptyContent='No tasks found'
            onRowClick={(t) => router.push(`/app/tasks/${t.id}`)}
          />
        </div>
      </CardBody>
    </Card>
  );
}
