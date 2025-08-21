'use client';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input } from '@/app/_components/UI';
import type { Tables } from '@/lib/supabase/database.types';
import createClient from '@/lib/supabase/browser';

type Space = Pick<Tables<'Space'>, 'id' | 'name' | 'created_at' | 'description'>;

export default function CreateSpaceModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (space: Space) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => name.trim().length > 0 && !saving, [name, saving]);

  const reset = useCallback(() => {
    setName('');
    setDescription('');
    setSaving(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError(null);
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
    const payload: Partial<Tables<'Space'>> & { name: string; user_id: string } = {
      name: name.trim(),
      user_id: user.id,
    } as any;
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
    if (data) onCreated(data);
    onClose();
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
            <h3 className='text-lg font-medium'>Create Space</h3>
            <form className='mt-3 grid gap-4' onSubmit={onSubmit}>
              {error && (
                <div className='text-danger border-danger/40 bg-danger/10 rounded-md border p-2 text-sm'>
                  {error}
                </div>
              )}
              <Input
                label='Space name'
                placeholder='e.g., Personal, Work, Project X'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div>
                <label className='text-foreground-600 text-xs'>Description (optional)</label>
                <textarea
                  className='focus:ring-primary/60 mt-1 min-h-24 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2'
                  placeholder='Briefly describe this space'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='mt-1 flex items-center justify-end gap-2'>
                <Button variant='bordered' radius='full' onClick={onClose} type='button'>
                  Cancel
                </Button>
                <Button type='submit' radius='full' isDisabled={!canSave} isLoading={saving}>
                  Create Space
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

