import { create } from 'zustand'

interface SnackbarState {
  isOpen: boolean
  message: string
  color?: string
  timeout?: number
  show: (message: string, color?: string, timeout?: number) => void
  hide: () => void
}

let timeoutId: NodeJS.Timeout | null = null

export const useSnackbarStore = create<SnackbarState>((set) => ({
  isOpen: false,
  message: '',
  color: 'success',
  timeout: 5000,
  show: (message, color = 'success', timeout = 5000) => {
    if (timeoutId) clearTimeout(timeoutId)
    set({ isOpen: true, message, color, timeout })
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        set({ isOpen: false })
        timeoutId = null
      }, timeout)
    }
  },
  hide: () => {
    if (timeoutId) clearTimeout(timeoutId)
    set({ isOpen: false })
    timeoutId = null
  },
}))
