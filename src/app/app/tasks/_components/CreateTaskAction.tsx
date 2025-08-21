'use client';
import { useState } from 'react';
import type { Tables } from '@/lib/supabase/database.types';
import { Button, Card, CardBody } from '@/app/_components/UI';
import CreateTaskGlobalModal from './CreateTaskGlobalModal';

type Space = Pick<Tables<'Space'>, 'id' | 'name'>;

export default function CreateTaskAction({ spaces }: { spaces: Space[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card shadow='sm' className='bg-content2 border border-neutral-700'>
        <CardBody className='flex items-center justify-between p-4'>
          <div>
            <p className='font-medium'>Create a new task</p>
            <p className='text-foreground-600 text-sm'>Plan and track tasks across spaces</p>
            {spaces.length === 0 && (
              <p className='text-foreground-500 mt-1 text-xs'>You need a space to add tasks.</p>
            )}
          </div>
          <Button
            onClick={() => setOpen(true)}
            variant='bordered'
            radius='full'
            size='sm'
            isDisabled={spaces.length === 0}
          >
            New Task
          </Button>
        </CardBody>
      </Card>
      <CreateTaskGlobalModal open={open} onClose={() => setOpen(false)} spaces={spaces} />
    </>
  );
}
