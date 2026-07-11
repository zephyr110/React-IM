import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Phone, Video, MoreVertical } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useMessages } from 'context/MessageContext'
import useBlockedList from 'hooks/useBlockedList'
import { useToast } from 'hooks/useToast'
import { cn } from '@/lib/utils'
import avatarImg from 'assets/images/avatar.jpg'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'

function getAvatarSrc(avatar) {
    const map = {
        'avatar-1': avatarImg1,
        'avatar-2': avatarImg2,
    }
    return map[avatar] || avatarImg
}

function TitleBar ({
    onAvatarClick,
    onVideoClick,
    onCloseConversation,
    titleBarAnimation,
    style,
    children,
    ...rest
}) {
    const { contacts, activeContactId } = useMessages()
    const { blockContact } = useBlockedList()
    const { showToast } = useToast()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const activeContact = contacts.find(c => c.id === activeContactId)

    useEffect(() => {
        if (!dropdownOpen) return
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [dropdownOpen])

    const handleProfile = () => {
        setDropdownOpen(false)
        onAvatarClick && onAvatarClick()
    }

    const handleClose = () => {
        setDropdownOpen(false)
        onCloseConversation && onCloseConversation()
    }

    const handleBlock = () => {
        setDropdownOpen(false)
        if (activeContactId) {
            blockContact(activeContactId)
            showToast(`已屏蔽 ${activeContact?.name || activeContactId}`, 'warning')
            onCloseConversation && onCloseConversation()
        }
    }

    return (
        <div
            className="h-16 border-b flex items-center px-4 gap-3"
            style={{ ...style, ...titleBarAnimation }}
            {...rest}
        >
            {/* Avatar with status indicator */}
            <div className="relative cursor-pointer shrink-0" onClick={onAvatarClick}>
                <Avatar className="w-10 h-10">
                    <AvatarImage src={getAvatarSrc(activeContact?.avatar)} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {activeContact && (
                    <span
                        className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
                            activeContact.online ? 'bg-green-500' : 'bg-gray-400'
                        )}
                    />
                )}
            </div>

            {/* Contact info */}
            <div className="flex-1 min-w-0">
                <p className="text-base font-medium truncate">
                    {activeContact?.name || '选择联系人'}
                </p>
                <p className="text-sm text-muted-foreground">
                    <span>{activeContact?.online ? '在线' : '离线'}</span>
                    {activeContact && <span> · 最后阅读：3小时前</span>}
                </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
                <button
                    className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    title="语音通话"
                >
                    <Phone className="w-5 h-5" />
                </button>
                <button
                    className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    onClick={onVideoClick}
                    title="视频通话"
                >
                    <Video className="w-5 h-5" />
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 top-10 bg-popover border shadow-md rounded-lg py-1.5 min-w-[140px] z-50">
                            <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                                onClick={handleProfile}
                            >
                                个人资料
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                                onClick={handleClose}
                            >
                                关闭会话
                            </button>
                            <Separator className="my-1" />
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-accent transition-colors"
                                onClick={handleBlock}
                            >
                                屏蔽此人
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

TitleBar.propTypes = {
    children: PropTypes.any,
    onAvatarClick: PropTypes.func,
    onVideoClick: PropTypes.func,
    onCloseConversation: PropTypes.func,
    titleBarAnimation: PropTypes.object,
    style: PropTypes.object,
}

export default TitleBar
