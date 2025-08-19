"use client";
import type { Tables } from '@/lib/supabase/database.types';
import { Button, Chip, Input, DropdownSelect } from '@/app/_components/UI';
import EventActions from './EventActions';
import { useEffect, useRef, useState } from 'react';
import { formatRelativeTime } from '@/lib/relative-time';
import { eventPriorityColor } from '@/lib/uiColors';
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
    const patch: Partial<Tables<'Event'>> = {};
    if (name !== event.Name) (patch as any).Name = name.trim();
    const dateISO = new Date(date).toISOString();
    if (event.date !== dateISO) (patch as any).date = dateISO as any;
    if ((priority ?? null) !== (event.priority ?? null)) (patch as any).priority = (priority ?? null) as any;
    if ((description || null) !== (event.description || null)) (patch as any).description = description || null;
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
          <EventActions
            id={event.id}
            name={event.Name}
            spaceId={event.Space?.id ?? null}
            spaceName={event.Space?.name ?? null}
            date={event.date}
            description={event.description ?? ''}
          />
        </div>
      </header>

      <div className='bg-content2 rounded-md border border-neutral-700'>
        <div className='p-4'>
          {!editing ? (
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-foreground-500 text-sm'>Date</p>
                <p className='font-medium'>
                  {new Date(event.date).toLocaleString()}
                  <span className='text-foreground-500'> • {formatRelativeTime(event.date)}</span>
                </p>
              </div>
              <div>
                <p className='text-foreground-500 text-sm'>Priority</p>
                <div className='mt-1'>
                  <Chip size='sm' variant='solid' color={eventPriorityColor(event.priority)} className='capitalize'>
                    {event.priority ?? 'none'}
                  </Chip>
                </div>
              </div>
              <div>
                <p className='text-foreground-500 text-sm'>Created</p>
                <p className='font-medium'>
                  {new Date(event.created_at).toLocaleString()}
                  <span className='text-foreground-500'> • {formatRelativeTime(event.created_at)}</span>
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
                <div className='sm:col-span-2 text-danger text-sm border border-danger/40 rounded-md p-2 bg-danger/10'>
                  {error}
                </div>
              )}
              {!error && saved && (
                <div className='sm:col-span-2 text-success text-sm border border-success/40 rounded-md p-2 bg-success/10'>
                  Saved
                </div>
              )}
              <div className='sm:col-span-2'>
                <Input ref={nameRef as any} label='Name' value={name} onChange={(e) => setName(e.target.value)} required isDisabled={saving} />
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
                    onClick={() => setDate(toLocalInputFromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))}
                    isDisabled={saving}
                  >
                    +1 day
                  </Button>
                  <Button
                    variant='bordered'
                    size='sm'
                    radius='full'
                    onClick={() => setDate(toLocalInputFromDate(nextWeekday(date ? new Date(date) : new Date(), 1)))}
                    isDisabled={saving}
                  >
                    Next Monday
                  </Button>
                  <Button
                    variant='bordered'
                    size='sm'
                    radius='full'
                    onClick={() => setDate(toLocalInputFromDate(nextWeekday(date ? new Date(date) : new Date(), 5)))}
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
                  onChange={(v) => setPriority((v || null) as any)}
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
                <label className='text-xs text-foreground-600'>Description</label>
                <textarea
                  className='mt-1 w-full min-h-28 rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                  placeholder='Describe the event'
                />
              </div>
              <div className='sm:col-span-2 flex items-center gap-2'>
                <Button type='submit' isDisabled={saving || !isDirty} isLoading={saving} radius='full'>
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
