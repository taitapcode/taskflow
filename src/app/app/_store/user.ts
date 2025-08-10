import type { User as SupabaseUser } from '@supabase/supabase-js';
import { create } from 'zustand';
import z from 'zod';

const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  displayName: z.string().min(1),
  avatarUrl: z.url().optional(),
});

type User = z.infer<typeof userSchema>;

type UserStore = {
  user: User | null;
  updateUser: (user: SupabaseUser) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  updateUser: (user) => {
    const { data, success } = userSchema.safeParse({
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.display_name || user.email,
      avatarUrl: user.user_metadata?.avatar_url,
    });
    if (success) {
      set({ user: data });
    }
  },
  logout: () => set({ user: null }),
}));
