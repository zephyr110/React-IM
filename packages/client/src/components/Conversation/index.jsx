import React, { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { useMessages } from 'context/MessageContext'
import ChatBubble from 'components/ChatBubble'
import VoiceMessage from 'components/VoiceMessage'
import Footer from 'components/Footer'
import TitleBar from 'components/TitleBar'

function Conversation ({ onAvatarClick, onVideoClick, ...rest }) {
  const { messages, activeContactId, userId, closeConversation } = useMessages()
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

  // Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeContactId) {
        closeConversation()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeContactId, closeConversation])

  const titleBarAnimation = useSpring({
    from: { opacity: 0, transform: 'translate3d(0px, -20px, 0px)' },
    to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
    delay: 100,
  })

  const conversationAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  })

  const footerAnimation = useSpring({
    from: { opacity: 0, transform: 'translate3d(0px, 10px, 0px)' },
    to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
    delay: 300,
  })

  return (
    <div className='flex flex-col h-full bg-background' {...rest}>
      <animated.div style={titleBarAnimation}>
        <TitleBar onAvatarClick={onAvatarClick} onVideoClick={onVideoClick} onCloseConversation={closeConversation} />
      </animated.div>
      <animated.div style={conversationAnimation} className='flex-1 overflow-y-auto px-4 py-3 space-y-1'>
        {currentMessages.map((msg) => {
          const isMine = msg.from === userId
          return (
            <ChatBubble key={msg.id} type={isMine ? 'mine' : undefined} time={formatTime(msg.time)} message={msg}>
              {msg.type === 'voice'
                ? <VoiceMessage type={isMine ? 'mine' : undefined} time={(typeof msg.duration === 'number' ? `${msg.duration}"` : msg.duration) || msg.content} audioSrc={msg.content?.startsWith('data:') ? msg.content : null} />
                : msg.type === 'image' ? null : msg.content
              }
            </ChatBubble>
          )
        })}
        {currentMessages.length === 0 && (
          <div className='flex items-center justify-center h-full'>
            <p className='text-muted-foreground text-sm'>选择一个联系人开始聊天</p>
          </div>
        )}
      </animated.div>
      <animated.div style={footerAnimation}>
        <Footer />
      </animated.div>
    </div>
  )
}

export default Conversation
