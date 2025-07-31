'use client'

import { useThemeStore } from '@/store/themeStore'
import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { isDark, setTheme } = useThemeStore()

    useEffect(() => {
        // Initialize theme on mount
        const savedTheme = localStorage.getItem('theme-storage')
        if (savedTheme) {
            const { state } = JSON.parse(savedTheme)
            setTheme(state.isDark)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark)
        }
    }, [setTheme])

    return <>{children}</>
}