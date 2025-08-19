"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Card, CardBody, Chip } from '@/app/_components/UI';
import DataTable, { type Column } from '../../_components/DataTable';
import { useRouter } from 'next/navigation';

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
  const eventsBySpace = new Map<number, EventWithSpace[]>();
  for (const s of spaces) eventsBySpace.set(s.id, []);
  for (const e of events) {
    const list = eventsBySpace.get(e.space_id);
    if (list) list.push(e);
  }

  const nonEmptySpaces = spaces.filter((s) => (eventsBySpace.get(s.id)?.length ?? 0) > 0);
  const hasAny = events.length > 0;

  if (!hasAny) {
    return (
      <Card shadow='sm' className='bg-content2 border border-neutral-700'>
        <CardBody className='p-6 text-foreground-500 text-sm'>No events found</CardBody>
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
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
              <Chip size='sm' variant='solid' color={priorityColor(e.priority)} className='capitalize'>
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
              <DataTable
                ariaLabel={`Events in ${space.name}`}
                data={rows}
                columns={columns}
                getKey={(e) => e.id}
                emptyContent='No events in this space'
                onRowClick={(e) => router.push(`/app/events/${e.id}`)}
              />
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
