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

  const sendTextMessage = useCallback((content) => {
    if (!activeContactId || !content.trim()) return
    emit('message:send', {
      to: activeContactId,
      content: content.trim(),
      type: 'text',
    }, (res) => {
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
  }, [loadHistory])

  const closeConversation = useCallback(() => {
    setActiveContactId(null)
  }, [])

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
