'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime } from '@/lib/utils'
import { useChatStore, type Chatroom } from '@/store/chatStore'
import { MessageCircle, Trash2 } from 'lucide-react'

interface ChatroomListProps {
    chatrooms: Chatroom[]
    onDelete: (chatroomId: string, e: React.MouseEvent) => void
}

export default function ChatroomList({ chatrooms, onDelete }: ChatroomListProps) {
    const { currentChatroom, setCurrentChatroom } = useChatStore()

    if (chatrooms.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    No conversations yet
                </h3>
                <p className="text-sm text-muted-foreground">
                    Start your first chat to get the conversation going!
                </p>
            </div>
        )
    }

    return (
        <div className="p-3 space-y-1">
            {chatrooms.map((chatroom) => (
                <div
                    key={chatroom.id}
                    onClick={() => setCurrentChatroom(chatroom.id)}
                    className={`
            group relative p-4 cursor-pointer transition-all duration-200 rounded-lg
            ${currentChatroom === chatroom.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                            : 'hover:bg-muted/50'
                        }
          `}
                >
                    <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                AI
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`
                  text-sm font-semibold truncate
                  ${currentChatroom === chatroom.id
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-foreground'
                                    }
                `}>
                                    {chatroom.title}
                                </h3>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => onDelete(chatroom.id, e)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {chatroom.lastMessage && (
                                <p className="text-xs text-muted-foreground truncate mb-2">
                                    {chatroom.lastMessage.sender === 'ai' ? 'AI: ' : 'You: '}
                                    {chatroom.lastMessage.content}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    {chatroom.lastMessage
                                        ? formatTime(chatroom.lastMessage.timestamp)
                                        : formatDate(chatroom.createdAt)
                                    }
                                </span>

                                {chatroom.messageCount > 0 && (
                                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                                        {chatroom.messageCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}