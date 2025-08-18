"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Link as UILink } from '@heroui/react';
import NextLink from 'next/link';
import { colorForLabel } from '@/lib/color';

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
  return (
    <Card shadow='sm' className='bg-content2 border border-neutral-700'>
      <CardBody className='p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-lg font-medium'>Recent Tasks</h2>
        </div>
        <Table aria-label='Recent tasks table' removeWrapper>
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Space</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Deadline</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No tasks found'}>
            {tasks.slice(0, 10).map((t) => (
              <TableRow key={t.id}>
                <TableCell className='max-w-[260px] truncate'>
                  <UILink as={NextLink} href={`/app/tasks/${t.id}`} underline='hover' className='truncate text-white'>
                    {t.name}
                  </UILink>
                </TableCell>
                <TableCell className='max-w-[180px] truncate'>
                  {t.Space?.name ? (
                    <Chip
                      size='sm'
                      variant='solid'
                      className={`${colorForLabel(t.Space.name).bg} ${colorForLabel(t.Space.name).text} border-transparent`}
                    >
                      {t.Space.name}
                    </Chip>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  <Chip size='sm' variant='solid' color={statusColor(t.status)} className='capitalize'>
                    {t.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip size='sm' variant='solid' color={priorityColor(t.priority)} className='capitalize'>
                    {t.priority ?? 'none'}
                  </Chip>
                </TableCell>
                <TableCell>
                  {t.deadline ? new Date(t.deadline).toLocaleDateString() : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
