import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';

type TaskWithSpace = Tables<'Task'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return <main>Invalid task id</main>;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('Task')
    .select('id,name,description,deadline,priority,status,created_at,space_id,Space(id,name)')
    .eq('id', id)
    .single<TaskWithSpace>();

  if (error) return <main>Error loading task: {error.message}</main>;
  if (!data) return <main>Task not found</main>;

  const task = data;

  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header>
        <h1 className='text-2xl font-semibold'>{task.name}</h1>
        <p className='text-foreground-500 mt-1 text-sm'>Space: {task.Space?.name ?? '—'}</p>
      </header>

      <div className='bg-content2 rounded-md border border-neutral-700'>
        <div className='p-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <p className='text-sm text-foreground-500'>Status</p>
              <p className='font-medium capitalize'>{task.status}</p>
            </div>
            <div>
              <p className='text-sm text-foreground-500'>Priority</p>
              <p className='font-medium capitalize'>{task.priority ?? 'none'}</p>
            </div>
            <div>
              <p className='text-sm text-foreground-500'>Deadline</p>
              <p className='font-medium'>{task.deadline ? new Date(task.deadline).toLocaleString() : '—'}</p>
            </div>
            <div>
              <p className='text-sm text-foreground-500'>Created</p>
              <p className='font-medium'>{new Date(task.created_at).toLocaleString()}</p>
            </div>
            <div className='sm:col-span-2'>
              <p className='text-sm text-foreground-500'>Description</p>
              <p className='font-medium whitespace-pre-wrap'>{task.description ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
