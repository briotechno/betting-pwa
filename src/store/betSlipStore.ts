import { create } from 'zustand'

export interface BetSelection {
  id: string
  matchId: string
  matchName: string
  marketName: string
  selectionName: string
  odds: number
  betType: 'back' | 'lay'
  stake?: number
}

interface BetSlipState {
  isOpen: boolean
  selections: BetSelection[]
  stakes: Record<string, number>
  openSlip: () => void
  closeSlip: () => void
  toggleSlip: () => void
  addSelection: (selection: BetSelection) => void
  removeSelection: (id: string) => void
  setStake: (id: string, stake: number) => void
  clearAll: () => void
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  isOpen: false,
  selections: [],
  stakes: {},

  openSlip: () => set({ isOpen: true }),
  closeSlip: () => set({ isOpen: false }),
  toggleSlip: () => set((state) => ({ isOpen: !state.isOpen })),

  addSelection: (selection) => {
    const existing = get().selections.find((s) => s.id === selection.id)
    if (existing) {
      // Remove if clicking same selection
      set((state) => ({
        selections: state.selections.filter((s) => s.id !== selection.id),
      }))
    } else {
      set((state) => ({
        selections: [...state.selections, selection],
        isOpen: true,
      }))
    }
  },

  removeSelection: (id) => {
    set((state) => {
      const newStakes = { ...state.stakes }
      delete newStakes[id]
      return {
        selections: state.selections.filter((s) => s.id !== id),
        stakes: newStakes,
      }
    })
  },

  setStake: (id, stake) => {
    set((state) => ({
      stakes: { ...state.stakes, [id]: stake },
    }))
  },

  clearAll: () => set({ selections: [], stakes: {}, isOpen: false }),
}))
