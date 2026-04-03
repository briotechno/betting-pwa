import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email: string
  balance: number
  tier: 'Beginner' | 'Silver' | 'Gold' | 'Platinum'
  avatar?: string;
  loginToken?: string;
  lastLoginAt?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  updateBalance: (balance: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ 
        user: user ? { ...user, lastLoginAt: Date.now() } : null, 
        isAuthenticated: !!user 
      }),
      setToken: (token) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, loginToken: token || '' } : null 
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateBalance: (balance) =>
        set((state) => ({
          user: state.user ? { ...state.user, balance } : null,
        })),
    }),
    {
      name: 'fairbet-auth',
    }
  )
)
