import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledChatBubble, { Time, BubbleTip, Bubble, MessageText, QuoteCard, ImageContent, RevokedText, ReadStatus, ContextMenu, ContextMenuItem } from './style'
import BubbleTipIcon from 'assets/icons/bubbleTip.svg?react'

function ChatBubble ({ children, type, time, message, ...rest }) {
    const [showMenu, setShowMenu] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    const handleContextMenu = (e) => {
        e.preventDefault()
        setMenuPos({ x: e.clientX, y: e.clientY })
        setShowMenu(true)
    }

    const handleCloseMenu = () => {
        setShowMenu(false)
    }

    const handleQuote = () => {
        if (message && typeof window !== 'undefined' && window.__setQuoteMessage) {
            window.__setQuoteMessage(message)
        }
        setShowMenu(false)
    }

    // Handle image messages
    if (message?.type === 'image') {
        return (
            <StyledChatBubble type={type} {...rest} onContextMenu={handleContextMenu}>
                <Bubble style={{ padding: 4, background: 'transparent', boxShadow: 'none' }}>
                    <ImageContent
                        src={message.content}
                        alt="sent image"
                        onClick={() => window.open(message.content, '_blank')}
                    />
                </Bubble>
                <Time>{time}</Time>
                {message.read && type === 'mine' && <ReadStatus>已读</ReadStatus>}
                {/* Context menu */}
                {showMenu && (
                    <ContextMenu style={{ left: menuPos.x, top: menuPos.y, position: 'fixed' }} onClick={handleCloseMenu}>
                        <ContextMenuItem onClick={handleQuote}>引用</ContextMenuItem>
                    </ContextMenu>
                )}
            </StyledChatBubble>
        )
    }

    // Handle revoked messages
    if (message?.revoked) {
        return (
            <StyledChatBubble type={type} {...rest}>
                <Bubble>
                    <RevokedText>
                        {type === 'mine' ? '你撤回了一条消息' : '对方撤回了一条消息'}
                    </RevokedText>
                </Bubble>
                <Time>{time}</Time>
            </StyledChatBubble>
        )
    }

    // Render message content with @mention highlighting
    const renderContent = () => {
        if (!children || typeof children !== 'string') return children

        // Highlight @mentions
        const parts = children.split(/(@\S+)/g)
        return parts.map((part, i) => {
            if (part.startsWith('@')) {
                return <span key={i} style={{ color: '#4f9dde', fontWeight: 'bold' }}>{part}</span>
            }
            return part
        })
    }

    return (
        <StyledChatBubble type={type} {...rest} onContextMenu={handleContextMenu}>
            <Bubble>
                <BubbleTip icon={BubbleTipIcon} width={40} height={28} color='#fff' />
                {/* Quoted message card */}
                {message?.quote && (
                    <QuoteCard>
                        <div style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>
                            {message.quote.from === (message.from) ? '自己' : '对方'}
                        </div>
                        <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {message.quote.content?.substring(0, 80)}
                        </div>
                    </QuoteCard>
                )}
                <MessageText>{renderContent()}</MessageText>
            </Bubble>
            <Time>{time}</Time>
            {message?.read && type === 'mine' && <ReadStatus>已读</ReadStatus>}
            {/* Right-click context menu */}
            {showMenu && (
                <ContextMenu
                    style={{ left: menuPos.x, top: menuPos.y, position: 'fixed', zIndex: 10000 }}
                    onClick={handleCloseMenu}
                >
                    <ContextMenuItem onClick={handleQuote}>引用</ContextMenuItem>
                </ContextMenu>
            )}
        </StyledChatBubble>
    )
}

ChatBubble.propTypes = {
    children: PropTypes.any,
    type: PropTypes.oneOf(['mine']),
    time: PropTypes.string,
    message: PropTypes.object,
}

export default ChatBubble
