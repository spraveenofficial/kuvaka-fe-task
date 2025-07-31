'use client'

import { useChatStore } from '@/store/chatStore'
import { useEffect, useRef, useState } from 'react'
import MessageItem from './MessageItem'
import MessageSkeleton from './MessageSkeleton'

export default function MessageList() {
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const { getCurrentMessages, currentChatroom, loadMessages } = useChatStore()

    const messages = getCurrentMessages()

    // Auto-scroll to bottom for new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    // Handle infinite scroll for older messages
    const handleScroll = async () => {
        const container = messagesContainerRef.current
        if (!container || loading) return

        if (container.scrollTop === 0 && messages.length >= 20) {
            setLoading(true)

            // Simulate loading delay
            setTimeout(() => {
                const olderMessages = loadMessages(currentChatroom!, page + 1)
                if (olderMessages.length > 0) {
                    setPage(prev => prev + 1)
                }
                setLoading(false)
            }, 500)
        }
    }

    useEffect(() => {
        const container = messagesContainerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [loading, messages.length, page])

    // Reset page when chatroom changes
    useEffect(() => {
        setPage(1)
    }, [currentChatroom])

    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                        <span className="text-3xl">💬</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        Start the conversation
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Send a message to begin your AI-powered conversation.
                        Ask questions, get creative, or just chat!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={messagesContainerRef}
            className="h-full overflow-y-auto custom-scrollbar p-4"
        >
            {/* Loading skeleton for older messages */}
            {loading && (
                <div className="mb-4">
                    <MessageSkeleton />
                    <MessageSkeleton isUser />
                    <MessageSkeleton />
                </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    isLast={index === messages.length - 1}
                />
            ))}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
        </div>
    )
}