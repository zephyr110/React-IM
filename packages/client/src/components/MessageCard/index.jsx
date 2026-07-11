import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function MessageCard ({
    avatarSrc,
    avatarStatus,
    name,
    time,
    message,
    unreadCount = 0,
    active = false,
    onClick,
    children,
    ...rest
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors',
                active ? 'bg-accent' : 'hover:bg-accent/50'
            )}
            onClick={onClick}
            {...rest}
        >
            {/* Avatar with online/offline indicator */}
            <div className="relative shrink-0">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span
                    className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background',
                        avatarStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    )}
                />
            </div>

            {/* Name and message preview */}
            <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', active && 'text-accent-foreground')}>
                    {name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {message}
                </p>
            </div>

            {/* Time and unread badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs text-muted-foreground">{time}</span>
                {unreadCount > 0 && (
                    <Badge variant="default" className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </div>
        </div>
    )
}

MessageCard.propTypes = {
    avatarSrc: PropTypes.string.isRequired,
    avatarStatus: PropTypes.any,
    name: PropTypes.any,
    time: PropTypes.any,
    message: PropTypes.any,
    unreadCount: PropTypes.number,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.any,
}

export default MessageCard
