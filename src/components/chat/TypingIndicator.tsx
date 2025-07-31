'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function TypingIndicator() {
    return (
        <div className="flex justify-start mb-4">
            <div className="max-w-[80%] sm:max-w-[70%]">
                {/* Avatar */}
                <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                            AI
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground animate-pulse">
                        Gemini is typing...
                    </span>
                </div>

                {/* Typing animation */}
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-slate-800 shadow-md border border-border">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>

                    {/* Subtle indicator */}
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-slate-400 opacity-30" />
                </div>
            </div>
        </div>
    )
}