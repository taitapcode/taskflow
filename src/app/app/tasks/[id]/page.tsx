import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import TaskDetail from './_components/TaskDetail';

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
      <TaskDetail task={task} />
    </main>
  );
}
