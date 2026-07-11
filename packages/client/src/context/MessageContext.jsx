import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSocket } from './SocketContext'
import useBlockedList from 'hooks/useBlockedList'
import { useToast } from 'hooks/useToast'

const MessageContext = createContext(null)

export function MessageProvider ({ children }) {
  const { socket, connected, emit, on, userId } = useSocket()
  const { isBlocked } = useBlockedList()
  const { showToast } = useToast()
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState({})
  const [activeContactId, setActiveContactId] = useState(null)
  const [unreadCounts, setUnreadCounts] = useState({})

  // 监听联系人列表
  useEffect(() => {
    const cleanup = on('contacts', (list) => {
      setContacts(list)
    })
    return cleanup
  }, [on])

  // 监听新消息
  useEffect(() => {
    const cleanup = on('message:new', (msg) => {
      // Filter out messages from blocked users
      if (isBlocked(msg.from)) return

      const otherId = msg.from
      setMessages(prev => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), msg],
      }))
      // Increment unread count if not currently chatting with sender
      setUnreadCounts(prev => {
        if (otherId === activeContactId) return prev
        return { ...prev, [otherId]: (prev[otherId] || 0) + 1 }
      })
    })
    return cleanup
  }, [on, activeContactId, isBlocked])

  // 监听消息撤回
  useEffect(() => {
    const cleanup = on('message:revoked', ({ messageId }) => {
      setMessages(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(contactId => {
          next[contactId] = next[contactId].map(m =>
            m.id === messageId ? { ...m, revoked: true } : m
          )
        })
        return next
      })
    })
    return cleanup
  }, [on])

  // 监听已读回执
  useEffect(() => {
    const cleanup = on('message:read', ({ messageId }) => {
      setMessages(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(contactId => {
          next[contactId] = next[contactId].map(m =>
            m.id === messageId ? { ...m, read: true } : m
          )
        })
        return next
      })
    })
    return cleanup
  }, [on])

  // 监听用户上线/下线
  useEffect(() => {
    const onlineCleanup = on('user:online', ({ userId: uid, name }) => {
      setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: true } : c))
      // Find contact name if not provided in event
      setContacts(prev => {
        const contact = prev.find(c => c.id === uid)
        const displayName = name || contact?.name || uid
        showToast(`${displayName} 上线了`, 'info')
        return prev
      })
    })
    const offlineCleanup = on('user:offline', ({ userId: uid }) => {
      setContacts(prev => {
        const contact = prev.find(c => c.id === uid)
        showToast(`${contact?.name || uid} 离线了`, 'info')
        return prev.map(c => c.id === uid ? { ...c, online: false } : c)
      })
    })
    return () => { onlineCleanup(); offlineCleanup() }
  }, [on, showToast])

  const sendTextMessage = useCallback((content, quote) => {
    if (!activeContactId || !content.trim()) return
    const payload = {
      to: activeContactId,
      content: content.trim(),
      type: 'text',
    }
    if (quote) payload.quote = quote
    emit('message:send', payload, (res) => {
      if (res?.success) {
        setMessages(prev => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), res.message],
        }))
      } else {
        showToast('消息发送失败，请重试', 'error')
      }
    })
  }, [activeContactId, emit, showToast])

  const sendVoiceMessage = useCallback((audioBlob, duration) => {
    if (!activeContactId || !audioBlob) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Audio = reader.result
      emit('message:send', {
        to: activeContactId,
        content: base64Audio,
        type: 'voice',
        duration: duration,
      }, (res) => {
        if (res?.success) {
          setMessages(prev => ({
            ...prev,
            [activeContactId]: [...(prev[activeContactId] || []), res.message],
          }))
        } else {
          showToast('语音消息发送失败，请重试', 'error')
        }
      })
    }
    reader.readAsDataURL(audioBlob)
  }, [activeContactId, emit, showToast])

  const sendImageMessage = useCallback((imageFile) => {
    if (!activeContactId || !imageFile) return
    // Compress/resize image to max 800px wide before sending
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxWidth = 800
        let { width, height } = img
        if (width > maxWidth) {
          height = (maxWidth / width) * height
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const base64 = canvas.toDataURL('image/jpeg', 0.7)
        emit('message:send', {
          to: activeContactId,
          content: base64,
          type: 'image',
        }, (res) => {
          if (res?.success) {
            setMessages(prev => ({
              ...prev,
              [activeContactId]: [...(prev[activeContactId] || []), res.message],
            }))
          } else {
            showToast('图片发送失败，请重试', 'error')
          }
        })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(imageFile)
  }, [activeContactId, emit, showToast])

  const loadHistory = useCallback((contactId) => {
    emit('message:history', { with: contactId }, (history) => {
      setMessages(prev => ({
        ...prev,
        [contactId]: history,
      }))
    })
  }, [emit])

  const openConversation = useCallback((contactId) => {
    setActiveContactId(contactId)
    loadHistory(contactId)
    setUnreadCounts(prev => {
      if (!prev[contactId]) return prev
      const next = { ...prev }
      delete next[contactId]
      return next
    })
    // Send read receipt for last message in this conversation
    setMessages(prev => {
      const msgs = prev[contactId] || []
      const lastMsg = msgs[msgs.length - 1]
      if (lastMsg && lastMsg.from !== userId && !lastMsg.read) {
        emit('message:read', { from: lastMsg.from, messageId: lastMsg.id })
      }
      return prev
    })
  }, [loadHistory, userId, emit])

  const closeConversation = useCallback(() => {
    setActiveContactId(null)
  }, [])

  const revokeMessage = useCallback((messageId) => {
    if (!activeContactId) return
    emit('message:revoke', { messageId, to: activeContactId }, (res) => {
      if (res?.success) {
        setMessages(prev => ({
          ...prev,
          [activeContactId]: (prev[activeContactId] || []).map(m =>
            m.id === messageId ? { ...m, revoked: true } : m
          ),
        }))
      } else {
        showToast(res?.error || '撤回失败', 'error')
      }
    })
  }, [activeContactId, emit, showToast])

  return (
    <MessageContext.Provider value={{
      contacts,
      messages,
      unreadCounts,
      activeContactId,
      connected,
      userId,
      sendTextMessage,
      sendVoiceMessage,
      sendImageMessage,
      revokeMessage,
      openConversation,
      closeConversation,
      loadHistory,
    }}>
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages () {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error('useMessages must be used within MessageProvider')
  return ctx
}
