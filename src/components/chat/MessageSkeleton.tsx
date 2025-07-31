'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface MessageSkeletonProps {
    isUser?: boolean
}

export default function MessageSkeleton({ isUser = false }: MessageSkeletonProps) {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
                {/* Avatar skeleton */}
                {!isUser && (
                    <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="skeleton" />
                        </Avatar>
                        <div className="w-12 h-3 skeleton rounded" />
                    </div>
                )}

                {/* Message bubble skeleton */}
                <Card
                    className={`
            p-4 space-y-2 border-2
            ${isUser
                            ? 'bg-muted border-muted ml-auto rounded-br-sm'
                            : 'bg-card border-border rounded-bl-sm'
                        }
          `}
                >
                    <div className="space-y-2">
                        <div className="w-full h-4 skeleton rounded" />
                        <div className="w-3/4 h-4 skeleton rounded" />
                        <div className="w-1/2 h-4 skeleton rounded" />
                    </div>

                    <div className="w-16 h-3 skeleton rounded" />
                </Card>

                {/* User label skeleton */}
                {isUser && (
                    <div className="flex items-center justify-end gap-2 mt-2">
                        <div className="w-8 h-3 skeleton rounded" />
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="skeleton" />
                        </Avatar>
                    </div>
                )}
            </div>
        </div>
    )
}