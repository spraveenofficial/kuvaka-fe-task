'use client'

import { useChatStore } from '@/store/chatStore'
import { useState } from 'react'
import ChatInterface from '../chat/ChatInterface'
import Sidebar from './Sidebar'
import WelcomeScreen from './WelcomeScreen'

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { currentChatroom } = useChatStore()

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {currentChatroom ? (
                    <ChatInterface onMenuClick={() => setSidebarOpen(true)} />
                ) : (
                    <WelcomeScreen onMenuClick={() => setSidebarOpen(true)} />
                )}
            </div>
        </div>
    )
}