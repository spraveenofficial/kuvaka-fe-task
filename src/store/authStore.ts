import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    phone: string
    countryCode: string
    name?: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (user: User) => void
    logout: () => void
    setLoading: (loading: boolean) => void
    initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: (user: User) => {
                set({ user, isAuthenticated: true, isLoading: false })
            },

            logout: () => {
                set({ user: null, isAuthenticated: false })
                localStorage.removeItem('chatrooms')
                localStorage.removeItem('messages')
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            initializeAuth: () => {
                const state = get()
                if (state.user) {
                    set({ isAuthenticated: true })
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
)