'use client';
import type { Tables, TablesUpdate } from '@/lib/supabase/database.types';
import { Button, Chip, Input, DropdownSelect } from '@/app/_components/UI';
import EventActions from './EventActions';
import { useEffect, useRef, useState } from 'react';
import { formatRelativeTime } from '@/lib/relative-time';
import { eventPriorityColor } from '@/lib/uiColors';
import { formatDate } from '@/lib/date';
import createClient from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

type Space = Pick<Tables<'Space'>, 'id' | 'name'>;
type EventWithSpace = Tables<'Event'> & { Space?: Space | null };

function toLocalInput(dt: string) {
  const d = new Date(dt);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function toLocalInputFromDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function nextWeekday(base: Date, weekday: number) {
  const d = new Date(base);
  const day = d.getDay();
  const diff = (weekday + 7 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export default function EventDetail({ event }: { event: EventWithSpace }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(event.Name);
  const [priority, setPriority] = useState<EventWithSpace['priority'] | null | undefined>(
    event.priority,
  );
  const [date, setDate] = useState<string>(toLocalInput(event.date));
  const [description, setDescription] = useState(event.description ?? '');

  const initial = useRef({
    name: event.Name,
    priority: event.priority ?? null,
    date: new Date(event.date).toISOString(),
    description: event.description ?? '',
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const isDirty =
    name.trim() !== initial.current.name ||
    (priority ?? null) !== (initial.current.priority ?? null) ||
    new Date(date).toISOString() !== initial.current.date ||
    (description || '') !== (initial.current.description || '');

  function resetForm() {
    setName(event.Name);
    setPriority(event.priority);
    setDate(toLocalInput(event.date));
    setDescription(event.description ?? '');
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!isDirty) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const patch: TablesUpdate<'Event'> = {};
    if (name !== event.Name) patch.Name = name.trim();
    const dateISO = new Date(date).toISOString();
    if (event.date !== dateISO) patch.date = dateISO;
    if ((priority ?? null) !== (event.priority ?? null)) patch.priority = priority ?? null;
    if ((description || null) !== (event.description || null))
      patch.description = description || null;
    const { error: upErr } = await supabase.from('Event').update(patch).eq('id', event.id);
    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    router.refresh();
  }

  useEffect(() => {
    if (editing) nameRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (editing && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [editing, isDirty]);

  useEffect(() => {
    if (!editing) return;
    const keyHandler = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
      if (isSave) {
        e.preventDefault();
        const form = document.getElementById('event-edit-form') as HTMLFormElement | null;
        form?.requestSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (!isDirty || window.confirm('Discard unsaved changes?')) {
          setName(initial.current.name);
          setPriority(initial.current.priority);
          setDate(toLocalInput(initial.current.date));
          setDescription(initial.current.description);
          setEditing(false);
        }
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [editing, isDirty]);

  return (
    <>
      <header className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>{event.Name}</h1>
          <p className='text-foreground-500 mt-1 text-sm'>Space: {event.Space?.name ?? '—'}</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='bordered'
            size='sm'
            radius='full'
            onClick={() => (editing ? (resetForm(), setEditing(false)) : setEditing(true))}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <EventActions />
        </div>
      </header>

      <div className='bg-content2 rounded-md border border-neutral-700'>
        <div className='p-4'>
          {!editing ? (
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-foreground-500 text-sm'>Date</p>
                <div className='flex items-center gap-2 font-medium'>
                  <span>{formatDate(event.date)}</span>
                  <span className='text-foreground-500'>• {formatRelativeTime(event.date)}</span>
                  {event.overdue && (
                    <Chip size='sm' variant='solid' color='danger'>
                      Overdue
                    </Chip>
                  )}
                </div>
              </div>
              <div>
                <p className='text-foreground-500 text-sm'>Priority</p>
                <div className='mt-1'>
                  <Chip
                    size='sm'
                    variant='solid'
                    color={eventPriorityColor(event.priority)}
                    className='capitalize'
                  >
                    {event.priority ?? 'none'}
                  </Chip>
                </div>
              </div>
              <div>
                <p className='text-foreground-500 text-sm'>Created</p>
                <p className='font-medium'>
                  {formatDate(event.created_at)}
                  <span className='text-foreground-500'>
                    {' '}
                    • {formatRelativeTime(event.created_at)}
                  </span>
                </p>
              </div>
              <div className='sm:col-span-2'>
                <p className='text-foreground-500 text-sm'>Description</p>
                <p className='font-medium whitespace-pre-wrap'>{event.description ?? '—'}</p>
              </div>
            </div>
          ) : (
            <form id='event-edit-form' className='grid gap-4 sm:grid-cols-2' onSubmit={onSave}>
              {error && (
                <div className='text-danger border-danger/40 bg-danger/10 rounded-md border p-2 text-sm sm:col-span-2'>
                  {error}
                </div>
              )}
              {!error && saved && (
                <div className='text-success border-success/40 bg-success/10 rounded-md border p-2 text-sm sm:col-span-2'>
                  Saved
                </div>
              )}
              <div className='sm:col-span-2'>
                <Input
                  ref={nameRef}
                  label='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  isDisabled={saving}
                />
              </div>
              <div>
                <Input
                  label='Date'
                  type='datetime-local'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  isDisabled={saving}
                />
                <div className='mt-2 flex flex-wrap gap-2 text-xs'>
                  <Button
                    variant='bordered'
                    size='sm'
                    radius='full'
                    onClick={() =>
                      setDate(toLocalInputFromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))
                    }
                    isDisabled={saving}
                  >
                    +1 day
                  </Button>
                  <Button
                    variant='bordered'
                    size='sm'
                    radius='full'
                    onClick={() =>
                      setDate(
                        toLocalInputFromDate(nextWeekday(date ? new Date(date) : new Date(), 1)),
                      )
                    }
                    isDisabled={saving}
                  >
                    Next Monday
                  </Button>
                  <Button
                    variant='bordered'
                    size='sm'
                    radius='full'
                    onClick={() =>
                      setDate(
                        toLocalInputFromDate(nextWeekday(date ? new Date(date) : new Date(), 5)),
                      )
                    }
                    isDisabled={saving}
                  >
                    Next Friday
                  </Button>
                </div>
              </div>
              <div>
                <DropdownSelect
                  label='Priority'
                  value={priority ?? ''}
                  onChange={(v) => {
                    const opts = ['low', 'medium', 'high', 'imidiate'] as const;
                    const isPriority = (x: string): x is NonNullable<Tables<'Event'>['priority']> =>
                      (opts as readonly string[]).includes(x);
                    setPriority(v === '' ? null : isPriority(v) ? v : null);
                  }}
                  options={[
                    { label: 'None', value: '' },
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Imidiate', value: 'imidiate' },
                  ]}
                  variant='flat'
                  isDisabled={saving}
                />
              </div>
              <div className='sm:col-span-2'>
                <label className='text-foreground-600 text-xs'>Description</label>
                <textarea
                  className='focus:ring-primary/60 mt-1 min-h-28 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                  placeholder='Describe the event'
                />
              </div>
              <div className='flex items-center gap-2 sm:col-span-2'>
                <Button
                  type='submit'
                  isDisabled={saving || !isDirty}
                  isLoading={saving}
                  radius='full'
                >
                  Save changes
                </Button>
                <Button
                  type='button'
                  variant='bordered'
                  radius='full'
                  onClick={() => {
                    if (!isDirty || window.confirm('Discard unsaved changes?')) {
                      resetForm();
                      setEditing(false);
                    }
                  }}
                  isDisabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
