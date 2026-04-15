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
  // Fields for API placement
  eventId: string
  marketId: string
  selectionId: string
  marketType: string
  marketIndex: number
  runnersCount?: number
  noVal?: number
  yesVal?: number
}

export interface Bet {
  Game: string;
  Selection: string;
  Type: string;
  Rate: string;
  Stake: string;
  Date: string;
  Side: 'back' | 'lay';
  IsMatched?: string;
  gid?: string;
  eventId?: string;
  matchId?: string;
}

interface BetSlipState {
  isOpen: boolean
  selections: BetSelection[]
  stakes: Record<string, number>
  confirmBeforePlace: boolean
  autoAcceptOdds: boolean
  myBets: Bet[]
  quickStakes: number[]
  setMyBets: (bets: Bet[]) => void
  setQuickStakes: (stakes: number[]) => void
  fetchQuickStakes: (loginToken: string) => Promise<void>
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
  myBets: [],
  quickStakes: [100, 500, 1000, 5000, 10000, 25000],

  setMyBets: (bets) => set({ myBets: bets }),
  setQuickStakes: (stakes) => set({ quickStakes: stakes }),

  fetchQuickStakes: async (loginToken) => {
    try {
      const { userController } = await import('@/controllers/user/userController')
      const res = await userController.getStakeButtons(loginToken)
      
      // Handle the object-based response format: {"1": {"Btnname": "S1", "Btnval": "1008"}, ...}
      if (res && (typeof res === 'object')) {
        const stakeValues: number[] = []
        // Iterate through expected keys 1-6
        for (let i = 1; i <= 6; i++) {
          const item = res[i.toString()] || res[i]
          if (item && item.Btnval) {
            const val = parseInt(item.Btnval)
            if (!isNaN(val)) stakeValues.push(val)
          }
        }

        if (stakeValues.length > 0) {
          set({ quickStakes: stakeValues })
        }
      }
    } catch (err) {
      console.error('Failed to fetch quick stakes:', err)
    }
  },

  openSlip: () => set({ isOpen: true }),
  closeSlip: () => set({ isOpen: false }),
  toggleSlip: () => set((state) => ({ isOpen: !state.isOpen })),

  addSelection: (selection) => {
    // Force one bet at a time by replacing the entire selections array
    set({
      selections: [selection],
      stakes: { [selection.id]: 0 }, // Reset stake for the new selection
      isOpen: true,
    })
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


