'use client';
import { useState } from 'react';
import type { Tables } from '@/lib/supabase/database.types';
import { Button, Card, CardBody } from '@/app/_components/UI';
import CreateEventGlobalModal from './CreateEventGlobalModal';

type Space = Pick<Tables<'Space'>, 'id' | 'name'>;

export default function CreateEventAction({ spaces }: { spaces: Space[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card shadow='sm' className='bg-content2 border border-neutral-700'>
        <CardBody className='flex items-center justify-between p-4'>
          <div>
            <p className='font-medium'>Create a new event</p>
            <p className='text-foreground-600 text-sm'>Schedule events within your spaces</p>
            {spaces.length === 0 && (
              <p className='text-foreground-500 mt-1 text-xs'>You need a space to add events.</p>
            )}
          </div>
          <Button
            onClick={() => setOpen(true)}
            variant='bordered'
            radius='full'
            size='sm'
            isDisabled={spaces.length === 0}
          >
            New Event
          </Button>
        </CardBody>
      </Card>
      <CreateEventGlobalModal open={open} onClose={() => setOpen(false)} spaces={spaces} />
    </>
  );
}
