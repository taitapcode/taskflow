import createClient from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import TasksBySpace from './_components/TasksBySpace';
import CreateTaskAction from './_components/CreateTaskAction';
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
    <main className='flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden'>
      <header className='shrink-0'>
        <div>
          <h1 className='text-2xl font-semibold'>Tasks</h1>
          <p className='text-foreground-500 mt-1 text-sm'>All tasks across your spaces</p>
        </div>
      </header>
      <div className='shrink-0'>
        <CreateTaskAction spaces={spaces ?? []} />
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto pb-20 md:pb-0 scrollbar-hide'>
        <TasksBySpace spaces={spaces ?? []} tasks={tasks} />
      </div>
    </main>
  );
}
