import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
    isDark: boolean
    toggleTheme: () => void
    setTheme: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDark: false,

            toggleTheme: () => {
                set((state) => {
                    const newTheme = !state.isDark
                    if (typeof window !== 'undefined') {
                        document.documentElement.classList.toggle('dark', newTheme)
                    }
                    return { isDark: newTheme }
                })
            },

            setTheme: (isDark: boolean) => {
                set({ isDark })
                if (typeof window !== 'undefined') {
                    document.documentElement.classList.toggle('dark', isDark)
                }
            },
        }),
        {
            name: 'theme-storage',
        }
    )
)