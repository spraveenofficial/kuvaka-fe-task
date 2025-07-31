'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useChatStore } from '@/store/chatStore'
import { Brain, Lightbulb, Menu, MessageCircle, PenTool, Sparkles, Wrench } from 'lucide-react'
import { useState } from 'react'
import CreateChatroomModal from './CreateChatroomModal'

interface WelcomeScreenProps {
    onMenuClick: () => void
}

export default function WelcomeScreen({ onMenuClick }: WelcomeScreenProps) {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const { createChatroom, setCurrentChatroom } = useChatStore()

    const handleQuickStart = (title: string) => {
        const chatroomId = createChatroom(title)
        setCurrentChatroom(chatroomId)
    }

    const quickStartOptions = [
        {
            title: 'Creative Writing',
            icon: PenTool,
            description: 'Get help with stories, poems, and creative content',
            color: 'text-pink-500'
        },
        {
            title: 'Learn & Explore',
            icon: Brain,
            description: 'Discover new topics and expand your knowledge',
            color: 'text-purple-500'
        },
        {
            title: 'Brainstorm Ideas',
            icon: Lightbulb,
            description: 'Generate innovative solutions and creative concepts',
            color: 'text-yellow-500'
        },
        {
            title: 'Problem Solving',
            icon: Wrench,
            description: 'Work through challenges with AI assistance',
            color: 'text-green-500'
        },
    ]

    return (
        <>
            <div className="flex flex-col h-full bg-background">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border lg:hidden bg-white dark:bg-slate-800">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-bold text-foreground">
                        Gemini Chat
                    </h1>
                    <div className="w-10" />
                </div>

                {/* Welcome content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full flex items-start justify-center p-4 lg:p-8 pt-8 lg:pt-16">
                        <div className="max-w-4xl mx-auto text-center w-full">
                            {/* Hero Section */}
                            <div className="mb-8 lg:mb-12">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-lg">
                                    <MessageCircle className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                                </div>
                            </div>

                            <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">
                                Welcome to Gemini Chat
                            </h1>

                            <p className="text-lg lg:text-xl text-muted-foreground mb-8 lg:mb-12 max-w-2xl mx-auto px-4">
                                Your intelligent AI companion is ready to help with anything you need.
                                Start a conversation and explore the possibilities together.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12 px-4">
                                {quickStartOptions.map((option, index) => {
                                    const IconComponent = option.icon
                                    return (
                                        <Card
                                            key={index}
                                            onClick={() => handleQuickStart(option.title)}
                                            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200 dark:hover:border-blue-800"
                                        >
                                            <CardHeader className="pb-3">
                                                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                                                    <IconComponent className={`w-6 h-6 ${option.color}`} />
                                                </div>
                                                <CardTitle className="text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {option.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <CardDescription className="text-left">
                                                    {option.description}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* CTA Button */}
                            <div className="mb-8 lg:mb-12 pb-8">
                                <Button
                                    onClick={() => setShowCreateModal(true)}
                                    size="lg"
                                    className="px-8 bg-blue-500 hover:bg-blue-600"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start New Conversation
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateChatroomModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </>
    )
}