import { create } from 'zustand'

interface SidebarStore {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (val: boolean) => void
}

interface NavStore {
  activeRouteLabel: string
  setActiveRouteLabel: (label: string) => void
}

interface AddAccountModalStore {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
  setCollapsed: (val) => set({ collapsed: val }),
}))

export const useNavStore = create<NavStore>((set) => ({
  activeRouteLabel: 'Dashboard',
  setActiveRouteLabel: (label) => set({ activeRouteLabel: label }),
}))

export const useAddAccountModalStore = create<AddAccountModalStore>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}))
