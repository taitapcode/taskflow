'use client';
import type { Tables, TablesUpdate } from '@/lib/supabase/database.types';
import { Button, Chip, Input, DropdownSelect } from '@/app/_components/UI';
import TaskActions from './TaskActions';
import { useEffect, useRef, useState, useCallback } from 'react';
import { formatRelativeTime } from '@/lib/relative-time';
import { taskPriorityColor, taskStatusColor } from '@/lib/uiColors';
import { formatDate } from '@/lib/date';
import createClient from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

type Space = Pick<Tables<'Space'>, 'id' | 'name'>;
type TaskWithSpace = Tables<'Task'> & { Space?: Space | null };

function toLocalInput(dt?: string | null) {
  if (!dt) return '';
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
  // weekday: 1=Mon ... 5=Fri etc. JS getDay(): 0=Sun..6=Sat
  const d = new Date(base);
  const day = d.getDay();
  const diff = (weekday + 7 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export default function TaskDetail({ task }: { task: TaskWithSpace }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(task.name);
  const [status, setStatus] = useState<TaskWithSpace['status']>(task.status);
  const [priority, setPriority] = useState<TaskWithSpace['priority'] | null | undefined>(
    task.priority,
  );
  const [deadline, setDeadline] = useState<string>(toLocalInput(task.deadline));
  const [description, setDescription] = useState(task.description ?? '');

  const initial = useRef({
    name: task.name,
    status: task.status,
    priority: task.priority ?? null,
    deadline: task.deadline ? new Date(task.deadline).toISOString() : null,
    description: task.description ?? '',
  });

  const nameRef = useRef<HTMLInputElement>(null);

  const deadlineISO = deadline ? new Date(deadline).toISOString() : null;
  const isDirty =
    name.trim() !== initial.current.name ||
    status !== initial.current.status ||
    (priority ?? null) !== (initial.current.priority ?? null) ||
    (deadlineISO ?? null) !== (initial.current.deadline ?? null) ||
    (description || '') !== (initial.current.description || '');

  const resetForm = useCallback(() => {
    setName(task.name);
    setStatus(task.status);
    setPriority(task.priority);
    setDeadline(toLocalInput(task.deadline));
    setDescription(task.description ?? '');
  }, [task]);

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
    const patch: TablesUpdate<'Task'> = {};
    if (name !== task.name) patch.name = name.trim();
    if (status !== task.status) patch.status = status;
    if ((priority ?? null) !== (task.priority ?? null)) patch.priority = priority ?? null;
    const deadlineISO = deadline ? new Date(deadline).toISOString() : null;
    if ((task.deadline ?? null) !== (deadlineISO ?? null)) patch.deadline = deadlineISO;
    if ((description || null) !== (task.description || null))
      patch.description = description || null;
    const { error: upErr } = await supabase.from('Task').update(patch).eq('id', task.id);
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

  // Focus first input when entering edit mode
  useEffect(() => {
    if (editing) nameRef.current?.focus();
  }, [editing]);

  // Warn before closing tab if editing with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (editing && isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [editing, isDirty]);

  // Keyboard shortcuts: Ctrl/Cmd+S to save, Esc to cancel
  useEffect(() => {
    if (!editing) return;
    const keyHandler = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
      if (isSave) {
        e.preventDefault();
        const form = document.getElementById('task-edit-form') as HTMLFormElement | null;
        form?.requestSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (!isDirty || window.confirm('Discard unsaved changes?')) {
          resetForm();
          setEditing(false);
        }
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [editing, isDirty, resetForm]);

  return (
    <>
      <header className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>{task.name}</h1>
          <p className='text-foreground-500 mt-1 text-sm'>Space: {task.Space?.name ?? '—'}</p>
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
          <TaskActions />
        </div>
      </header>

      <div className='bg-content2 rounded-md border border-neutral-700'>
        <div className='p-4'>
          {!editing ? (
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-foreground-500 text-sm'>Status</p>
                <div className='mt-1'>
                  <Chip
                    size='sm'
                    variant='solid'
                    color={taskStatusColor(task.status)}
                    className='capitalize'
                  >
                    {task.status}
                  </Chip>
                </div>
              </div>
              <div>
                <p className='text-foreground-500 text-sm'>Priority</p>
                <div className='mt-1'>
                  <Chip
                    size='sm'
                    variant='solid'
                    color={taskPriorityColor(task.priority)}
                    className='capitalize'
                  >
                    {task.priority ?? 'none'}
                  </Chip>
                </div>
              </div>
              <div>
                <p className='text-foreground-500 text-sm'>Deadline</p>
                <p className='font-medium'>
                  {task.deadline ? (
                    <>
                      {formatDate(task.deadline)}
                      <span className='text-foreground-500'>
                        {' '}
                        • {formatRelativeTime(task.deadline)}
                      </span>
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
              <div>
                <p className='text-foreground-500 text-sm'>Created</p>
                <p className='font-medium'>
                  {formatDate(task.created_at)}
                  <span className='text-foreground-500'>
                    {' '}
                    • {formatRelativeTime(task.created_at)}
                  </span>
                </p>
              </div>
              <div className='sm:col-span-2'>
                <p className='text-foreground-500 text-sm'>Description</p>
                <p className='font-medium whitespace-pre-wrap'>{task.description ?? '—'}</p>
              </div>
            </div>
          ) : (
            <form id='task-edit-form' className='grid gap-4 sm:grid-cols-2' onSubmit={onSave}>
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
                <DropdownSelect
                  label='Status'
                  value={status}
                  onChange={(v) => {
                    const opts = ['to-do', 'in-progress', 'done', 'overdue'] as const;
                    const isStatus = (x: string): x is Tables<'Task'>['status'] =>
                      (opts as readonly string[]).includes(x);
                    if (isStatus(v)) setStatus(v);
                  }}
                  options={[
                    { label: 'To-do', value: 'to-do' },
                    { label: 'In-progress', value: 'in-progress' },
                    { label: 'Done', value: 'done' },
                    { label: 'Overdue', value: 'overdue' },
                  ]}
                  variant='flat'
                  isDisabled={saving}
                />
              </div>
              <div>
                <DropdownSelect
                  label='Priority'
                  value={priority ?? ''}
                  onChange={(v) => {
                    const opts = ['low', 'medium', 'high', 'imidiate'] as const;
                    const isPriority = (x: string): x is NonNullable<Tables<'Task'>['priority']> =>
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
              <div>
                <Input
                  label='Deadline'
                  type='datetime-local'
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  isDisabled={saving}
                  endContent={
                    deadline ? (
                      <button
                        type='button'
                        onClick={() => setDeadline('')}
                        className='text-foreground-600 hover:text-foreground'
                        aria-label='Clear deadline'
                        disabled={saving}
                      >
                        ×
                      </button>
                    ) : null
                  }
                />
                <div className='mt-2 flex flex-wrap gap-2 text-xs'>
                  <Button
                    variant='bordered'
                    size='sm'
                    radius='full'
                    onClick={() =>
                      setDeadline(toLocalInputFromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))
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
                      setDeadline(
                        toLocalInputFromDate(
                          nextWeekday(deadline ? new Date(deadline) : new Date(), 1),
                        ),
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
                      setDeadline(
                        toLocalInputFromDate(
                          nextWeekday(deadline ? new Date(deadline) : new Date(), 5),
                        ),
                      )
                    }
                    isDisabled={saving}
                  >
                    Next Friday
                  </Button>
                </div>
              </div>
              <div className='sm:col-span-2'>
                <label className='text-foreground-600 text-xs'>Description</label>
                <textarea
                  className='focus:ring-primary/60 mt-1 min-h-28 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                  placeholder='Describe the task'
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
