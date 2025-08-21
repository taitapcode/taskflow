import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Update Task.status to 'overdue' when deadline is past now, excluding done/overdue
export async function updateOverdueTasksForSpaces(
  supabase: SupabaseClient<Database>,
  spaceIds: number[],
) {
  if (!spaceIds?.length) return { error: null } as const;
  const nowIso = new Date().toISOString();
  const { error } = await supabase
    .from('Task')
    .update({ status: 'overdue' })
    .in('space_id', spaceIds)
    .not('deadline', 'is', null)
    .lt('deadline', nowIso)
    .neq('status', 'done')
    .neq('status', 'overdue');
  return { error } as const;
}

export async function updateOverdueTaskById(
  supabase: SupabaseClient<Database>,
  taskId: number,
) {
  const nowIso = new Date().toISOString();
  const { error } = await supabase
    .from('Task')
    .update({ status: 'overdue' })
    .eq('id', taskId)
    .not('deadline', 'is', null)
    .lt('deadline', nowIso)
    .neq('status', 'done')
    .neq('status', 'overdue');
  return { error } as const;
}

// Update Event.overdue to true when event date is past now
export async function updateOverdueEventsForSpaces(
  supabase: SupabaseClient<Database>,
  spaceIds: number[],
) {
  if (!spaceIds?.length) return { error: null } as const;
  const nowIso = new Date().toISOString();
  const { error } = await supabase
    .from('Event')
    .update({ overdue: true })
    .in('space_id', spaceIds)
    .lt('date', nowIso)
    .eq('overdue', false);
  return { error } as const;
}

export async function updateOverdueEventById(
  supabase: SupabaseClient<Database>,
  eventId: number,
) {
  const nowIso = new Date().toISOString();
  const { error } = await supabase
    .from('Event')
    .update({ overdue: true })
    .eq('id', eventId)
    .lt('date', nowIso)
    .eq('overdue', false);
  return { error } as const;
}
