import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (!dateObj || isNaN(dateObj.getTime())) {
        return 'Invalid date'
    }

    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(dateObj)
}

export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (!dateObj || isNaN(dateObj.getTime())) {
        return 'Invalid date'
    }

    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
        return 'Today'
    } else if (diffInDays === 1) {
        return 'Yesterday'
    } else if (diffInDays < 7) {
        return `${diffInDays} days ago`
    } else {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        }).format(dateObj)
    }
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            func(...args)
        }, wait)
    }
}

export function copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => false)
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'absolute'
        textArea.style.left = '-999999px'

        document.body.prepend(textArea)
        textArea.select()

        try {
            document.execCommand('copy')
            return Promise.resolve(true)
        } catch (error) {
            return Promise.resolve(false)
        } finally {
            textArea.remove()
        }
    }
}

export function generateChatroomTitle(message: string): string {
    const words = message.trim().split(' ')
    const title = words.slice(0, 4).join(' ')
    return title.length > 30 ? title.substring(0, 30) + '...' : title
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })
}

export function safeDate(date?: Date | string | null): Date {
    if (!date) return new Date()

    const dateObj = typeof date === 'string' ? new Date(date) : date
    return isNaN(dateObj.getTime()) ? new Date() : dateObj
}