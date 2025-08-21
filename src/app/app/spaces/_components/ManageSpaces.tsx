'use client';
import type { Tables } from '@/lib/supabase/database.types';
import createClient from '@/lib/supabase/browser';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, Input } from '@/app/_components/UI';
import { formatDate } from '@/lib/date';

type Space = Pick<Tables<'Space'>, 'id' | 'name' | 'created_at' | 'description'>;

export default function ManageSpaces({ initial }: { initial: Space[] }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spaces, setSpaces] = useState<Space[]>(initial);
  const [description, setDescription] = useState('');

  async function createSpace(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const n = name.trim();
    if (!n) {
      setError('Space name is required');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      setSaving(false);
      setError(userErr?.message ?? 'You must be signed in');
      return;
    }
    const payload: Partial<Tables<'Space'>> = { name: n, user_id: user.id } as any;
    if (description.trim()) (payload as any).description = description.trim();
    const { data, error: err } = await supabase
      .from('Space')
      .insert(payload)
      .select('id,name,created_at,description')
      .single<Space>();
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data) setSpaces((prev) => [data, ...prev]);
    setName('');
    setDescription('');
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card shadow='sm' className='bg-content2 border border-neutral-700'>
        <CardBody className='p-4'>
          <form className='flex flex-col gap-3' onSubmit={createSpace}>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start'>
              <div className='flex-1'>
                <Input
                  label='Space name'
                  placeholder='e.g., Personal, Work, Project X'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isDisabled={saving}
                  isInvalid={Boolean(error)}
                  errorMessage={error ?? undefined}
                />
              </div>
              <Button
                type='submit'
                isDisabled={saving || !name.trim()}
                isLoading={saving}
                radius='full'
                className='shrink-0'
              >
                Create Space
              </Button>
            </div>
            <div>
              <label className='text-foreground-600 text-xs'>Description (optional)</label>
              <textarea
                className='focus:ring-primary/60 mt-1 min-h-24 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2'
                placeholder='Briefly describe this space'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
              />
            </div>
          </form>
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
                    <p className='font-medium underline-offset-2 group-hover:underline'>{s.name}</p>
                    {s.description && (
                      <p className='text-foreground-500 mt-1 line-clamp-2 text-sm'>{s.description}</p>
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
  );
}
