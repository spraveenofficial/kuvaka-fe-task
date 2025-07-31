'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { chatroomSchema, type ChatroomFormData } from '@/lib/validations'
import { useChatStore } from '@/store/chatStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CreateChatroomModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateChatroomModal({ isOpen, onClose }: CreateChatroomModalProps) {
    const { createChatroom, setCurrentChatroom } = useChatStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChatroomFormData>({
        resolver: zodResolver(chatroomSchema),
    })

    const handleFormSubmit = (data: ChatroomFormData) => {
        const chatroomId = createChatroom(data.title)
        setCurrentChatroom(chatroomId)
        toast.success('Chatroom created successfully!')
        reset()
        onClose()
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Chatroom</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Chatroom Title</Label>
                        <Input
                            {...register('title')}
                            id="title"
                            placeholder="Enter chatroom title..."
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}