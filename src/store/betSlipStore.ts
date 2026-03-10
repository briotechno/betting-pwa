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
  confirmBeforePlace: boolean
  autoAcceptOdds: boolean
  openSlip: () => void
  closeSlip: () => void
  toggleSlip: () => void
  addSelection: (selection: BetSelection) => void
  removeSelection: (id: string) => void
  setStake: (id: string, stake: number) => void
  updateStake: (id: string, delta: number) => void
  updateOdds: (id: string, delta: number) => void
  toggleConfirmBeforePlace: () => void
  toggleAutoAcceptOdds: () => void
  clearAll: () => void
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  isOpen: false,
  selections: [],
  stakes: {},
  confirmBeforePlace: true,
  autoAcceptOdds: false,


  openSlip: () => set({ isOpen: true }),
  closeSlip: () => set({ isOpen: false }),
  toggleSlip: () => set((state) => ({ isOpen: !state.isOpen })),

  addSelection: (selection) => {
    const existing = get().selections.find((s) => s.id === selection.id)
    if (existing) {
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

  updateStake: (id, delta) => {
    set((state) => {
      const currentStake = state.stakes[id] || 0
      const newStake = Math.max(0, currentStake + delta)
      return {
        stakes: { ...state.stakes, [id]: newStake },
      }
    })
  },

  updateOdds: (id, delta) => {
    set((state) => ({
      selections: state.selections.map((s) => 
        s.id === id ? { ...s, odds: Math.max(1.01, parseFloat((s.odds + delta).toFixed(2))) } : s
      ),
    }))
  },

  toggleConfirmBeforePlace: () => set((state) => ({ confirmBeforePlace: !state.confirmBeforePlace })),

  toggleAutoAcceptOdds: () => set((state) => ({ autoAcceptOdds: !state.autoAcceptOdds })),

  clearAll: () => set({ selections: [], stakes: {}, isOpen: false }),
}))


