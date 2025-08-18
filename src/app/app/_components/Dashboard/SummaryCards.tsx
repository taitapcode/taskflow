"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody } from '@heroui/react';
import {
  ListTodo,
  Circle,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
} from 'lucide-react';

type Props = {
  tasks: Tables<'Task'>[];
  events: Tables<'Event'>[];
};

function countByStatus(tasks: Tables<'Task'>[]) {
  return tasks.reduce(
    (acc, t) => {
      acc.total += 1;
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, 'to-do': 0, 'in-progress': 0, done: 0, overdue: 0 } as Record<string, number>,
  );
}

export default function SummaryCards({ tasks, events }: Props) {
  const counts = countByStatus(tasks);
  const upcoming = events.filter((e) => new Date(e.date) >= new Date());

  type ColorKey = 'primary' | 'warning' | 'success' | 'danger' | 'default';
  const colorClasses: Record<ColorKey, string> = {
    primary: 'bg-primary/15 text-primary',
    warning: 'bg-warning/15 text-warning',
    success: 'bg-success/15 text-success',
    danger: 'bg-danger/15 text-danger',
    default: 'bg-content3 text-foreground-500',
  };

  const items: Array<{
    label: string;
    value: number;
    color: ColorKey;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    { label: 'Total Tasks', value: counts.total, color: 'primary', Icon: ListTodo },
    { label: 'To Do', value: counts['to-do'], color: 'default', Icon: Circle },
    { label: 'In Progress', value: counts['in-progress'], color: 'warning', Icon: Clock3 },
    { label: 'Done', value: counts.done, color: 'success', Icon: CheckCircle2 },
    { label: 'Overdue', value: counts.overdue, color: 'danger', Icon: AlertTriangle },
    { label: 'Upcoming Events', value: upcoming.length, color: 'primary', Icon: CalendarDays },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
      {items.map(({ label, value, color, Icon }) => (
        <Card key={label} shadow='sm' className='bg-content2 border border-neutral-700'>
          <CardBody className='p-4'>
            <div className='flex items-center gap-3'>
              <div className={`flex h-9 w-9 items-center justify-center rounded-md ${colorClasses[color]}`}>
                <Icon size={18} />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-foreground-500'>{label}</span>
                <span className='text-xl font-semibold leading-tight'>{value}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
