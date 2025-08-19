"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip } from '@heroui/react';
import { colorForLabel } from '@/lib/color';
import DataTable, { type Column } from '../DataTable';
import { useRouter } from 'next/navigation';

type TaskWithSpace = Tables<'Task'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };
type Props = { tasks: TaskWithSpace[] };

function statusColor(status: Tables<'Task'>['status']) {
  switch (status) {
    case 'to-do':
      return 'default' as const;
    case 'in-progress':
      return 'warning' as const;
    case 'done':
      return 'success' as const;
    case 'overdue':
      return 'danger' as const;
    default:
      return 'default' as const;
  }
}

function priorityColor(priority: Tables<'Task'>['priority'] | null | undefined) {
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

export default function RecentTasks({ tasks }: Props) {
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
        <Chip size='sm' variant='solid' color={statusColor(t.status)} className='capitalize'>
          {t.status}
        </Chip>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      className: 'w-[14%] min-w-[120px]',
      cell: (t) => (
        <Chip size='sm' variant='solid' color={priorityColor(t.priority)} className='capitalize'>
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
        </div>
        <DataTable
          ariaLabel='Recent tasks table'
          data={tasks.slice(0, 10)}
          columns={columns}
          getKey={(t) => t.id}
          emptyContent='No tasks found'
          onRowClick={(t) => router.push(`/app/tasks/${t.id}`)}
        />
      </CardBody>
    </Card>
  );
}
