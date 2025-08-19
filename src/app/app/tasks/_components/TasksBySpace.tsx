"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip } from '@/app/_components/UI';
import DataTable, { type Column } from '../../_components/DataTable';
import { useRouter } from 'next/navigation';

type Space = Pick<Tables<'Space'>, 'id' | 'name'>;
type TaskWithSpace = Tables<'Task'> & { Space?: Space | null };

type Props = {
  spaces: Space[];
  tasks: TaskWithSpace[];
};

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

export default function TasksBySpace({ spaces, tasks }: Props) {
  const router = useRouter();
  const tasksBySpace = new Map<number, TaskWithSpace[]>();
  for (const s of spaces) tasksBySpace.set(s.id, []);
  for (const t of tasks) {
    const list = tasksBySpace.get(t.space_id);
    if (list) list.push(t);
  }

  const nonEmptySpaces = spaces.filter((s) => (tasksBySpace.get(s.id)?.length ?? 0) > 0);
  const hasAny = tasks.length > 0;

  if (!hasAny) {
    return (
      <Card shadow='sm' className='bg-content2 border border-neutral-700'>
        <CardBody className='p-6 text-foreground-500 text-sm'>No tasks found</CardBody>
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {nonEmptySpaces.map((space) => {
        const rows = tasksBySpace.get(space.id) ?? [];
        const columns: Column<TaskWithSpace>[] = [
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
              <Chip size='sm' variant='solid' color={statusColor(t.status)} className='capitalize'>
                {t.status}
              </Chip>
            ),
          },
          {
            key: 'priority',
            header: 'Priority',
            className: 'w-[12%] min-w-[120px]',
            cell: (t) => (
              <Chip size='sm' variant='solid' color={priorityColor(t.priority)} className='capitalize'>
                {t.priority ?? 'none'}
              </Chip>
            ),
          },
          {
            key: 'deadline',
            header: 'Deadline',
            className: 'w-[18%] min-w-[140px]',
            cell: (t) => (t.deadline ? new Date(t.deadline).toLocaleDateString() : '—'),
          },
          {
            key: 'created',
            header: 'Created',
            className: 'w-[18%] min-w-[140px]',
            cell: (t) => new Date(t.created_at).toLocaleDateString(),
          },
        ];

        return (
          <Card key={space.id} shadow='sm' className='bg-content2 border border-neutral-700'>
            <CardBody className='p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-lg font-medium'>{space.name}</h2>
              </div>
              <DataTable
                ariaLabel={`Tasks in ${space.name}`}
                data={rows}
                columns={columns}
                getKey={(t) => t.id}
                emptyContent='No tasks in this space'
                onRowClick={(t) => router.push(`/app/tasks/${t.id}`)}
              />
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
