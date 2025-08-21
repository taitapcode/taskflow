'use client';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Button, Input } from '@/app/_components/UI';

export default function EditSpaceModal({
  open,
  initialName,
  initialDescription,
  onSubmit,
  onClose,
}: {
  open: boolean;
  initialName: string;
  initialDescription?: string | null;
  onSubmit: (values: { name: string; description: string }) => Promise<void> | void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription ?? '');
      setSaving(false);
      setError(null);
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open, initialName, initialDescription]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const n = name.trim();
    if (!n) {
      setError('Space name is required');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ name: n, description });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='absolute inset-0 bg-black/60'
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role='dialog'
            aria-modal='true'
            className='relative z-10 w-[95vw] max-w-xl rounded-lg border border-neutral-700 bg-content1 p-4 shadow-xl'
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <h3 className='mb-2 text-lg font-medium'>Edit Space</h3>
            <form className='flex flex-col gap-3' onSubmit={submit}>
              {error && (
                <div className='text-danger border-danger/40 bg-danger/10 rounded-md border p-2 text-sm'>
                  {error}
                </div>
              )}
              <Input
                ref={nameRef}
                label='Space name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                isDisabled={saving}
                required
              />
              <div>
                <label className='text-foreground-600 text-xs'>Description</label>
                <textarea
                  className='focus:ring-primary/60 mt-1 min-h-28 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                  placeholder='Describe this space'
                />
              </div>
              <div className='flex items-center gap-2'>
                <Button type='submit' isDisabled={saving || !name.trim()} isLoading={saving} radius='full'>
                  Save
                </Button>
                <Button type='button' variant='bordered' radius='full' onClick={onClose} isDisabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

