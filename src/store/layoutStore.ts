import { create } from 'zustand'

interface LayoutState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  profileSidebarOpen: boolean
  setProfileSidebarOpen: (open: boolean) => void
  leftDrawerOpen: boolean
  setLeftDrawerOpen: (open: boolean) => void
  moreMenuOpen: boolean
  setMoreMenuOpen: (open: boolean) => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  profileSidebarOpen: false,
  setProfileSidebarOpen: (open) => set({ profileSidebarOpen: open }),
  leftDrawerOpen: false,
  setLeftDrawerOpen: (open) => set({ leftDrawerOpen: open }),
  moreMenuOpen: false,
  setMoreMenuOpen: (open) => set({ moreMenuOpen: open }),
}))
