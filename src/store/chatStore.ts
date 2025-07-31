import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
    id: string
    content: string
    sender: 'user' | 'ai'
    timestamp: Date
    image?: string
}

export interface Chatroom {
    id: string
    title: string
    createdAt: Date
    lastMessage?: Message
    messageCount: number
}

interface ChatState {
    chatrooms: Chatroom[]
    currentChatroom: string | null
    messages: Record<string, Message[]>
    isTyping: boolean
    searchQuery: string

    // Chatroom actions
    createChatroom: (title: string) => string
    deleteChatroom: (id: string) => void
    setCurrentChatroom: (id: string | null) => void

    // Message actions
    addMessage: (chatroomId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
    loadMessages: (chatroomId: string, page: number) => Message[]

    // UI actions
    setTyping: (typing: boolean) => void
    setSearchQuery: (query: string) => void

    // Getters
    getFilteredChatrooms: () => Chatroom[]
    getCurrentMessages: () => Message[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const generateAIResponse = (userMessage: string): string => {
    const responses = [
        "That's an interesting question! Let me think about that for a moment.",
        "I understand what you're asking. Here's my perspective on that topic.",
        "Great point! I'd like to elaborate on that idea.",
        "Thanks for sharing that with me. I have some thoughts on this.",
        "That's a fascinating topic. Let me provide you with some insights.",
        "I appreciate you bringing this up. Here's what I think about it.",
        "Excellent question! This is something I've been thinking about too.",
        "I see where you're coming from. Let me offer a different perspective.",
    ]

    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        return "Hello! I'm Gemini, your AI assistant. How can I help you today?"
    }

    if (userMessage.toLowerCase().includes('how are you')) {
        return "I'm doing great, thank you for asking! I'm here and ready to help with whatever you need."
    }

    return responses[Math.floor(Math.random() * responses.length)]
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            chatrooms: [],
            currentChatroom: null,
            messages: {},
            isTyping: false,
            searchQuery: '',

            createChatroom: (title: string) => {
                const id = generateId()
                const newChatroom: Chatroom = {
                    id,
                    title,
                    createdAt: new Date(),
                    messageCount: 0,
                }

                set((state) => ({
                    chatrooms: [newChatroom, ...state.chatrooms],
                    messages: { ...state.messages, [id]: [] }
                }))

                return id
            },

            deleteChatroom: (id: string) => {
                set((state) => {
                    const newMessages = { ...state.messages }
                    delete newMessages[id]

                    return {
                        chatrooms: state.chatrooms.filter(room => room.id !== id),
                        messages: newMessages,
                        currentChatroom: state.currentChatroom === id ? null : state.currentChatroom
                    }
                })
            },

            setCurrentChatroom: (id: string | null) => {
                set({ currentChatroom: id })
            },

            addMessage: (chatroomId: string, messageData: Omit<Message, 'id' | 'timestamp'>) => {
                const message: Message = {
                    ...messageData,
                    id: generateId(),
                    timestamp: new Date(),
                }

                set((state) => {
                    const roomMessages = state.messages[chatroomId] || []
                    const updatedMessages = [...roomMessages, message]

                    const updatedChatrooms = state.chatrooms.map(room =>
                        room.id === chatroomId
                            ? { ...room, lastMessage: message, messageCount: updatedMessages.length }
                            : room
                    )

                    return {
                        messages: { ...state.messages, [chatroomId]: updatedMessages },
                        chatrooms: updatedChatrooms
                    }
                })

                // Generate AI response if user message
                if (messageData.sender === 'user') {
                    set({ isTyping: true })

                    setTimeout(() => {
                        const aiResponse: Message = {
                            id: generateId(),
                            content: generateAIResponse(messageData.content),
                            sender: 'ai',
                            timestamp: new Date(),
                        }

                        set((state) => {
                            const roomMessages = state.messages[chatroomId] || []
                            const updatedMessages = [...roomMessages, aiResponse]

                            const updatedChatrooms = state.chatrooms.map(room =>
                                room.id === chatroomId
                                    ? { ...room, lastMessage: aiResponse, messageCount: updatedMessages.length }
                                    : room
                            )

                            return {
                                messages: { ...state.messages, [chatroomId]: updatedMessages },
                                chatrooms: updatedChatrooms,
                                isTyping: false
                            }
                        })
                    }, 1500 + Math.random() * 2000) // Random delay between 1.5-3.5 seconds
                }
            },

            loadMessages: (chatroomId: string, page: number) => {
                const messages = get().messages[chatroomId] || []
                const pageSize = 20
                const startIndex = Math.max(0, messages.length - (page * pageSize))
                const endIndex = messages.length - ((page - 1) * pageSize)

                return messages.slice(startIndex, endIndex)
            },

            setTyping: (typing: boolean) => {
                set({ isTyping: typing })
            },

            setSearchQuery: (query: string) => {
                set({ searchQuery: query })
            },

            getFilteredChatrooms: () => {
                const { chatrooms, searchQuery } = get()
                if (!searchQuery.trim()) return chatrooms

                return chatrooms.filter(room =>
                    room.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
            },

            getCurrentMessages: () => {
                const { messages, currentChatroom } = get()
                return currentChatroom ? messages[currentChatroom] || [] : []
            },
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                chatrooms: state.chatrooms,
                messages: state.messages
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Convert string dates back to Date objects
                    state.chatrooms = state.chatrooms.map(room => ({
                        ...room,
                        createdAt: new Date(room.createdAt),
                        lastMessage: room.lastMessage ? {
                            ...room.lastMessage,
                            timestamp: new Date(room.lastMessage.timestamp)
                        } : undefined
                    }))

                    Object.keys(state.messages).forEach(chatroomId => {
                        state.messages[chatroomId] = state.messages[chatroomId].map(message => ({
                            ...message,
                            timestamp: new Date(message.timestamp)
                        }))
                    })
                }
            },
        }
    )
)