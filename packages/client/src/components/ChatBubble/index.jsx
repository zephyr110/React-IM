import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Quote, Trash2 } from 'lucide-react'

function ChatBubble ({ children, type, time, message, ...rest }) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

  const handleContextMenu = (e) => {
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
    setShowMenu(true)
  }

  const handleQuote = () => {
    if (message && typeof window !== 'undefined' && window.__setQuoteMessage) {
      window.__setQuoteMessage(message)
    }
    setShowMenu(false)
  }

  const isMine = type === 'mine'

  // Image message
  if (message?.type === 'image') {
    return (
      <div className={cn('flex flex-col mb-3', isMine ? 'items-end' : 'items-start')} onContextMenu={handleContextMenu}>
        <div className='p-1 rounded-2xl overflow-hidden max-w-[220px] shadow-sm'>
          <img
            src={message.content}
            alt='sent'
            className='rounded-xl cursor-pointer hover:opacity-90 transition-opacity max-w-full'
            onClick={() => window.open(message.content, '_blank')}
          />
        </div>
        <span className='text-[11px] text-muted-foreground mt-1 px-1'>{time}</span>
        {message.read && isMine && <span className='text-[10px] text-muted-foreground'>已读</span>}
        {showMenu && (
          <div className='fixed z-50 bg-popover border rounded-lg shadow-lg p-1 min-w-[80px]' style={{ left: menuPos.x, top: menuPos.y }} onClick={() => setShowMenu(false)}>
            <button className='flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded hover:bg-accent' onClick={handleQuote}>
              <Quote className='w-3.5 h-3.5' /> 引用
            </button>
          </div>
        )}
      </div>
    )
  }

  // Revoked message
  if (message?.revoked) {
    return (
      <div className={cn('flex flex-col mb-3', isMine ? 'items-end' : 'items-start')}>
        <div className='px-4 py-2 rounded-2xl bg-muted/50 italic text-muted-foreground text-sm'>
          {isMine ? '你撤回了一条消息' : '对方撤回了一条消息'}
        </div>
        <span className='text-[11px] text-muted-foreground mt-1 px-1'>{time}</span>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col mb-3', isMine ? 'items-end' : 'items-start')} onContextMenu={handleContextMenu}>
      <div className={cn(
        'relative px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm',
        isMine ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-secondary-foreground rounded-bl-md'
      )}>
        {/* Quoted message card */}
        {message?.quote && (
          <div className={cn(
            'mb-2 px-2.5 py-1.5 rounded-lg text-xs border-l-[3px]',
            isMine ? 'bg-white/10 border-white/30 text-white/80' : 'bg-black/5 border-primary text-foreground/70'
          )}>
            <div className='font-medium mb-0.5 opacity-60'>
              {message.quote.from === message.from ? '自己' : '对方'}
            </div>
            <div className='truncate max-w-[200px]'>
              {message.quote.content?.substring(0, 50)}
            </div>
          </div>
        )}
        {/* Message content with @mention highlighting */}
        <div className='text-[15px] leading-relaxed whitespace-pre-wrap break-words'>
          {typeof children === 'string'
            ? children.split(/(@\S+)/g).map((part, i) =>
                part.startsWith('@')
                  ? <span key={i} className={cn('font-semibold', isMine ? 'text-white' : 'text-primary')}>{part}</span>
                  : part
              )
            : children
          }
        </div>
      </div>
      <span className='text-[11px] text-muted-foreground mt-1 px-1'>{time}</span>
      {message?.read && isMine && <span className='text-[10px] text-muted-foreground'>已读</span>}
      {/* Context menu */}
      {showMenu && (
        <div className='fixed z-50 bg-popover border rounded-lg shadow-lg p-1 min-w-[80px]' style={{ left: menuPos.x, top: menuPos.y }} onClick={() => setShowMenu(false)}>
          <button className='flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded hover:bg-accent' onClick={handleQuote}>
            <Quote className='w-3.5 h-3.5' /> 引用
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatBubble
