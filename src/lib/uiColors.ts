import type { Tables } from '@/lib/supabase/database.types';

export type ChipPalette = 'default' | 'primary' | 'warning' | 'success' | 'danger';

export function taskStatusColor(status: Tables<'Task'>['status']): ChipPalette {
  switch (status) {
    case 'to-do':
      return 'default';
    case 'in-progress':
      return 'warning';
    case 'done':
      return 'success';
    case 'overdue':
      return 'danger';
    default:
      return 'default';
  }
}

export function taskPriorityColor(
  priority: Tables<'Task'>['priority'] | null | undefined,
): ChipPalette {
  switch (priority) {
    case 'low':
      return 'default';
    case 'medium':
      return 'primary';
    case 'high':
      return 'warning';
    case 'imidiate':
      return 'danger';
    default:
      return 'default';
  }
}

export function eventPriorityColor(
  priority: Tables<'Event'>['priority'] | null | undefined,
): ChipPalette {
  switch (priority) {
    case 'low':
      return 'default';
    case 'medium':
      return 'primary';
    case 'high':
      return 'warning';
    case 'imidiate':
      return 'danger';
    default:
      return 'default';
  }
}
