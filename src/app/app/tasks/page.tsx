import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import TasksBySpace from './_components/TasksBySpace';
import { updateOverdueTasksForSpaces } from '@/lib/overdue';

type TaskWithSpace = Tables<'Task'> & { Space?: Pick<Tables<'Space'>, 'id' | 'name'> | null };

export default async function TasksPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) return <main>Error: {userError.message}</main>;

  const { data: spaces, error: spacesError } = await supabase
    .from('Space')
    .select('id,name')
    .eq('user_id', user?.id ?? '');
  if (spacesError) return <main>Error loading spaces: {spacesError.message}</main>;

  const spaceIds = (spaces ?? []).map((s) => s.id);

  let tasks: TaskWithSpace[] = [];
  if (spaceIds.length > 0) {
    // Auto-mark overdue tasks before fetching
    await updateOverdueTasksForSpaces(supabase, spaceIds);
    const { data: tasksData, error: tasksError } = await supabase
      .from('Task')
      .select('id,name,deadline,description,priority,status,space_id,created_at,Space(id,name)')
      .in('space_id', spaceIds)
      .order('created_at', { ascending: false });
    if (tasksError) return <main>Error loading tasks: {tasksError.message}</main>;
    tasks = (tasksData as unknown as TaskWithSpace[]) ?? [];
  }

  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header className='flex items-end justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>Tasks</h1>
          <p className='text-foreground-500 mt-1 text-sm'>All tasks across your spaces</p>
        </div>
      </header>

      <TasksBySpace spaces={spaces ?? []} tasks={tasks} />
    </main>
  );
}
