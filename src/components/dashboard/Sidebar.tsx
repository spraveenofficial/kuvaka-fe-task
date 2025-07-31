'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { debounce } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { useThemeStore } from '@/store/themeStore'
import { LogOut, MessageSquare, Moon, Plus, Search, Settings, Sun, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import ChatroomList from './ChatroomList'
import CreateChatroomModal from './CreateChatroomModal'

interface SidebarProps {
    onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const {
        chatrooms,
        searchQuery,
        setSearchQuery,
        deleteChatroom,
        currentChatroom,
        setCurrentChatroom
    } = useChatStore()
    const { user, logout } = useAuthStore()
    const { isDark, toggleTheme } = useThemeStore()

    const filteredChatrooms = useMemo(() => {
        if (!searchQuery.trim()) return chatrooms
        return chatrooms.filter(room =>
            room.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [chatrooms, searchQuery])

    const debouncedSearch = useMemo(
        () => debounce((query: string) => setSearchQuery(query), 300),
        [setSearchQuery]
    )

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value)
    }

    const handleDeleteChatroom = (chatroomId: string, e: React.MouseEvent) => {
        e.stopPropagation()

        if (confirm('Are you sure you want to delete this chatroom?')) {
            deleteChatroom(chatroomId)
            toast.success('Chatroom deleted')

            if (currentChatroom === chatroomId) {
                setCurrentChatroom(null)
            }
        }
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout()
            toast.success('Logged out successfully')
        }
    }

    return (
        <>
            <div className="h-full bg-white dark:bg-slate-900 border-r border-border flex flex-col shadow-lg">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 border-b border-border">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-foreground">
                                    Gemini Chat
                                </h1>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="lg:hidden"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full mb-4 bg-blue-500 hover:bg-blue-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Chat
                        </Button>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ChatroomList
                        chatrooms={filteredChatrooms}
                        onDelete={handleDeleteChatroom}
                    />
                </div>

                {/* Footer */}
                <div className="bg-white dark:bg-slate-800 border-t border-border">
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-slate-500 text-white font-semibold">
                                    {user?.phone.slice(-2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {user?.countryCode} {user?.phone}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    Online
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="flex-1"
                            >
                                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSettingsModal(true)}
                                className="flex-1"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="flex-1 text-red-500 hover:text-red-600"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateChatroomModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />

            <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Settings
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                <span className="font-medium">Theme</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleTheme}
                            >
                                {isDark ? 'Light' : 'Dark'}
                            </Button>
                        </div>
                        <Separator />
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="w-full"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}