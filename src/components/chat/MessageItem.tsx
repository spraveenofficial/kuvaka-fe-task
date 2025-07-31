'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { copyToClipboard, formatTime } from '@/lib/utils'
import { type Message } from '@/store/chatStore'
import { Check, Clock, Copy, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface MessageItemProps {
    message: Message
    isLast: boolean
}

export default function MessageItem({ message, isLast }: MessageItemProps) {
    const [copied, setCopied] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
    const messageRef = useRef<HTMLDivElement>(null)

    const isUser = message.sender === 'user'

    const handleCopy = async () => {
        const success = await copyToClipboard(message.content)

        if (success) {
            setCopied(true)
            toast.success('Message copied!')
            setTimeout(() => setCopied(false), 2000)
            setShowDetails(false)
        } else {
            toast.error('Failed to copy message')
        }
    }

    const handleLongPressStart = () => {
        const timer = setTimeout(() => {
            setShowDetails(true)
            navigator.vibrate?.(50) // Haptic feedback if available
        }, 500) // 500ms long press
        setLongPressTimer(timer)
    }

    const handleLongPressEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }
    }

    useEffect(() => {
        return () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer)
            }
        }
    }, [longPressTimer])

    return (
        <>
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
                <div
                    className={`
            relative max-w-[80%] sm:max-w-[70%] 
            ${isUser ? 'order-2' : 'order-1'}
          `}
                >
                    {/* Avatar for AI messages */}
                    {!isUser && (
                        <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                                    AI
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-muted-foreground">
                                Gemini
                            </span>
                        </div>
                    )}

                    {/* Message bubble */}
                    <div
                        ref={messageRef}
                        onMouseDown={handleLongPressStart}
                        onMouseUp={handleLongPressEnd}
                        onMouseLeave={handleLongPressEnd}
                        onTouchStart={handleLongPressStart}
                        onTouchEnd={handleLongPressEnd}
                        className={`
              relative px-4 py-3 rounded-2xl cursor-pointer select-none
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              ${isUser
                                ? 'bg-blue-500 text-white ml-auto rounded-br-md shadow-md hover:shadow-lg'
                                : 'bg-white dark:bg-slate-800 text-foreground rounded-bl-md shadow-md hover:shadow-lg border border-border'
                            }
            `}
                    >
                        {/* Image */}
                        {message.image && (
                            <div className="mb-3">
                                <img
                                    src={message.image}
                                    alt="Uploaded"
                                    className="max-w-full h-auto rounded-lg shadow-sm"
                                    style={{ maxHeight: '300px' }}
                                />
                            </div>
                        )}

                        {/* Text content */}
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </div>

                        {/* Subtle indicator for long press */}
                        <div className={`
              absolute -bottom-1 -right-1 w-2 h-2 rounded-full opacity-30
              ${isUser ? 'bg-blue-200' : 'bg-slate-400'}
            `} />
                    </div>

                    {/* User label */}
                    {isUser && (
                        <div className="flex items-center justify-end gap-2 mt-2">
                            <span className="text-xs font-medium text-muted-foreground">
                                You
                            </span>
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-slate-500 text-white text-xs font-semibold">
                                    <User className="h-3 w-3" />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Message Details
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Sent by: {isUser ? 'You' : 'Gemini'}</span>
                            <span>{formatTime(message.timestamp)}</span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleCopy}
                                className="flex-1"
                                variant="outline"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy Message
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => setShowDetails(false)}
                                variant="secondary"
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}