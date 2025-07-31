'use client'

import AuthPage from '@/components/auth/AuthPage'
import Dashboard from '@/components/dashboard/Dashboard'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
    const { isAuthenticated, initializeAuth } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        initializeAuth()
    }, [initializeAuth])

    if (isAuthenticated) {
        return <Dashboard />
    }

    return <AuthPage />
}