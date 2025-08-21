'use client';
import type { Tables } from '@/lib/supabase/database.types';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBody } from '@/app/_components/UI';
import CreateSpaceModal from './CreateSpaceModal';
import { formatDate } from '@/lib/date';

type Space = Pick<Tables<'Space'>, 'id' | 'name' | 'created_at' | 'description'>;

export default function ManageSpaces({ initial }: { initial: Space[] }) {
  const [spaces, setSpaces] = useState<Space[]>(initial);
  const [showCreate, setShowCreate] = useState(false);

  function onCreated(space: Space) {
    setSpaces((prev) => [space, ...prev]);
  }

  return (
    <>
      <div className='flex flex-col gap-6'>
        <Card shadow='sm' className='bg-content2 border border-neutral-700'>
          <CardBody className='flex items-center justify-between p-4'>
            <div>
              <p className='font-medium'>Create a new space</p>
              <p className='text-foreground-600 text-sm'>Organize tasks and events</p>
            </div>
            <Button onClick={() => setShowCreate(true)} variant='bordered' radius='full' size='sm'>
              New Space
            </Button>
          </CardBody>
        </Card>

        <Card shadow='sm' className='bg-content2 border border-neutral-700'>
          <CardBody className='p-4'>
            <h2 className='mb-3 text-lg font-medium'>Your Spaces</h2>
            {spaces.length === 0 ? (
              <p className='text-foreground-500 text-sm'>No spaces yet. Create one above.</p>
            ) : (
              <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                {spaces.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/app/spaces/${s.id}`}
                      className='bg-content3/20 hover:bg-content3/40 focus-visible:ring-primary/60 block rounded-md border border-neutral-800 p-3 transition-colors focus:outline-none focus-visible:ring-2'
                    >
                      <p className='font-medium underline-offset-2 group-hover:underline'>
                        {s.name}
                      </p>
                      {s.description && (
                        <p className='text-foreground-500 mt-1 line-clamp-2 text-sm'>
                          {s.description}
                        </p>
                      )}
                      <p className='text-foreground-600 mt-1 text-xs'>
                        Created {formatDate(s.created_at)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
      <CreateSpaceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={onCreated}
      />
    </>
  );
}
