'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Input, DropdownSelect } from '@/app/_components/UI';
import type { Tables } from '@/lib/supabase/database.types';
import createClient from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

type EventPriority = NonNullable<Tables<'Event'>['priority']>;
type Space = Pick<Tables<'Space'>, 'id' | 'name'>;

export default function CreateEventGlobalModal({
  open,
  spaces,
  onClose,
}: {
  open: boolean;
  spaces: Space[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [spaceId, setSpaceId] = useState<number | ''>('');
  const [priority, setPriority] = useState<EventPriority | ''>('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(
    () => name.trim().length > 0 && !!date && spaceId !== '' && !saving,
    [name, date, spaceId, saving],
  );

  const reset = useCallback(() => {
    setName('');
    setSpaceId('');
    setPriority('');
    setDate('');
    setDescription('');
    setSaving(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave || spaceId === '') return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const payload: import('@/lib/supabase/database.types').TablesInsert<'Event'> = {
      Name: name.trim(),
      space_id: spaceId,
      date: new Date(date).toISOString(),
      ...(priority ? { priority } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
    };
    const { error: err } = await supabase.from('Event').insert(payload).single();
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key='overlay'
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key='dialog'
            role='dialog'
            aria-modal='true'
            className='bg-content2 w-full max-w-lg rounded-md border border-neutral-700 p-4 shadow-2xl'
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-lg font-medium'>Create Event</h3>
            <form className='mt-3 grid gap-4' onSubmit={onSubmit}>
              {error && (
                <div className='text-danger border-danger/40 bg-danger/10 rounded-md border p-2 text-sm'>
                  {error}
                </div>
              )}

              <DropdownSelect
                label='Space'
                value={spaceId === '' ? '' : String(spaceId)}
                onChange={(v) => setSpaceId(v === '' ? '' : Number(v))}
                options={[
                  { label: 'Select a space…', value: '' },
                  ...spaces.map((s) => ({ label: s.name, value: String(s.id) })),
                ]}
                variant='flat'
              />

              <Input label='Name' value={name} onChange={(e) => setName(e.target.value)} required />

              <div className='grid gap-4 sm:grid-cols-2'>
                <DropdownSelect
                  label='Priority'
                  value={priority}
                  onChange={(v) => {
                    const opts = ['low', 'medium', 'high', 'immediate'] as const;
                    setPriority(
                      v === ''
                        ? ''
                        : (opts as readonly string[]).includes(v)
                          ? (v as EventPriority)
                          : '',
                    );
                  }}
                  options={[
                    { label: 'None', value: '' },
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Immediate', value: 'immediate' },
                  ]}
                  variant='flat'
                />

                <Input
                  label='Date'
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className='text-foreground-600 text-xs'>Description</label>
                <textarea
                  className='focus:ring-primary/60 mt-1 min-h-24 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Describe the event'
                />
              </div>

              <div className='mt-1 flex items-center justify-end gap-2'>
                <Button variant='bordered' radius='full' onClick={onClose} type='button'>
                  Cancel
                </Button>
                <Button type='submit' radius='full' isDisabled={!canSave} isLoading={saving}>
                  Create Event
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
