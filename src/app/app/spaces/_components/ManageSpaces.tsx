"use client";
import type { Tables } from '@/lib/supabase/database.types';
import createClient from '@/lib/supabase/browser';
import { useState } from 'react';
import { Button, Card, CardBody, Input } from '@/app/_components/UI';

type Space = Pick<Tables<'Space'>, 'id' | 'name' | 'created_at'>;

export default function ManageSpaces({ initial }: { initial: Space[] }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spaces, setSpaces] = useState<Space[]>(initial);

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
    const { data, error: err } = await supabase
      .from('Space')
      .insert({ name: n, user_id: user.id } as any)
      .select('id,name,created_at')
      .single<Space>();
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data) setSpaces((prev) => [data, ...prev]);
    setName('');
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card shadow='sm' className='bg-content2 border border-neutral-700'>
        <CardBody className='p-4'>
          <form className='flex flex-col gap-3 sm:flex-row sm:items-end' onSubmit={createSpace}>
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
            <Button type='submit' isDisabled={saving || !name.trim()} isLoading={saving} radius='full'>
              Create Space
            </Button>
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
                <li key={s.id} className='rounded-md border border-neutral-800 bg-content3/20 p-3'>
                  <p className='font-medium'>{s.name}</p>
                  <p className='text-foreground-600 text-xs mt-1'>Created {new Date(s.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
