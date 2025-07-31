'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { fileToBase64 } from '@/lib/utils'
import { useChatStore } from '@/store/chatStore'
import { Loader2, Menu, Paperclip, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import MessageList from './MessageList'
import TypingIndicator from './TypingIndicator'

interface ChatInterfaceProps {
    onMenuClick: () => void
}

export default function ChatInterface({ onMenuClick }: ChatInterfaceProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const {
        currentChatroom,
        addMessage,
        isTyping,
        chatrooms
    } = useChatStore()

    const currentRoom = chatrooms.find(room => room.id === currentChatroom)

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
        }
    }, [inputValue])

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Image size must be less than 5MB')
            return
        }

        setUploading(true)
        try {
            const base64 = await fileToBase64(file)
            setSelectedImage(base64)
            toast.success('Image uploaded successfully')
        } catch (error) {
            toast.error('Failed to process image')
        } finally {
            setUploading(false)
        }
    }

    const handleFormSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (!currentChatroom) return
        if (!inputValue || !inputValue.trim()) return

        addMessage(currentChatroom, {
            content: inputValue.trim(),
            sender: 'user',
            image: selectedImage || undefined,
        })

        setInputValue('')
        setSelectedImage(null)

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleFormSubmit()
        }
    }

    if (!currentChatroom || !currentRoom) {
        return null
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-border shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuClick}
                            className="lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                        AI
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">
                                    {currentRoom.title}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {isTyping ? 'Gemini is typing...' : 'AI Assistant • Online'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
                <MessageList />
            </div>

            {/* Typing indicator */}
            {isTyping && (
                <div className="px-4 py-2 bg-muted/30 border-t border-border">
                    <TypingIndicator />
                </div>
            )}

            {/* Image preview */}
            {selectedImage && (
                <div className="px-4 py-3 bg-muted/30 border-t border-border">
                    <div className="relative inline-block">
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                        />
                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Input form */}
            <div className="bg-white dark:bg-slate-800 border-t border-border shadow-sm">
                <div className="p-4">
                    <form onSubmit={handleFormSubmit} className="flex items-end gap-3">
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Paperclip className="h-5 w-5" />
                                )}
                            </Button>
                        </div>

                        <div className="flex-1">
                            <Textarea
                                ref={textareaRef}
                                placeholder="Type your message..."
                                onKeyDown={handleKeyDown}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                rows={1}
                                className="min-h-[44px] max-h-[120px] resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim() && !selectedImage}
                            className="h-11 w-11 bg-blue-500 hover:bg-blue-600"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}