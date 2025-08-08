import { create } from 'zustand';

type SidebarStore = {
  open: boolean;
  setOpen: () => void;
  setClose: () => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  open: false,
  setOpen: () => set({ open: true }),
  setClose: () => set({ open: false }),
}));
