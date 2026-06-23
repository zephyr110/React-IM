import React from 'react'
import PropTypes from 'prop-types'
import StyledConversation, { Conversations, MyChatBubble } from './style'
import TitleBar from 'components/TitleBar'
import ChatBubble from 'components/ChatBubble'
import VoiceMessage from 'components/VoiceMessage'
import Footer from 'components/Footer'
import { useSpring } from 'react-spring'
import { useMessages } from 'context/MessageContext'


function Conversation ({ onAvatarClick, onVideoClick, children, ...rest }) {
    const { messages, activeContactId, userId } = useMessages()
    const currentMessages = activeContactId ? (messages[activeContactId] || []) : []

    const formatTime = (timeStr) => {
        if (!timeStr) return ''
        const d = new Date(timeStr)
        const now = new Date()
        const isToday = d.toDateString() === now.toDateString()
        const time = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        if (isToday) return `今天 ${time}`
        return `${d.getMonth() + 1}/${d.getDate()} ${time}`
    }

    const titleBarAnimation = useSpring({
        from: { opacity: 0, transform: 'translate3d(0px, -50px, 0px)' },
        to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
        delay: 300,
    })

    const conversationAnimation = useSpring({
        from: { opacity: 0, transform: 'translate3d(50px, 0px, 0px)' },
        to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
        delay: 450,
    })

    const footerAnimation = useSpring({
        from: { opacity: 0, transform: 'translate3d(0px, 50px, 0px)' },
        to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
        delay: 600,
    })

    return (
        <StyledConversation {...rest}>
            <TitleBar
                onAvatarClick={onAvatarClick}
                onVideoClick={onVideoClick}
                titleBarAnimation={titleBarAnimation}
            />
            <Conversations style={conversationAnimation}>
                {currentMessages.map((msg) =>
                    msg.from === userId ? (
                        <MyChatBubble key={msg.id} time={formatTime(msg.time)}>
                            {msg.content}
                        </MyChatBubble>
                    ) : (
                        <ChatBubble key={msg.id} time={formatTime(msg.time)}>
                            {msg.type === 'voice'
                                ? <VoiceMessage time={msg.content} />
                                : msg.content
                            }
                        </ChatBubble>
                    )
                )}
                {currentMessages.length === 0 && (
                    <ChatBubble time=""> 选择一个联系人开始聊天 </ChatBubble>
                )}
            </Conversations>
            <Footer footerAnimation={footerAnimation} />
        </StyledConversation>
    )
}

Conversation.propTypes = {
    children: PropTypes.any
}

export default Conversation


