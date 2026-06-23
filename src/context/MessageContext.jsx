import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSocket } from './SocketContext'

const MessageContext = createContext(null)

export function MessageProvider ({ children }) {
  const { socket, connected, emit, on, userId } = useSocket()
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState({})
  const [activeContactId, setActiveContactId] = useState(null)

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
      const otherId = msg.from
      setMessages(prev => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), msg],
      }))
    })
    return cleanup
  }, [on])

  // 监听用户上线/下线
  useEffect(() => {
    const onlineCleanup = on('user:online', ({ userId: uid }) => {
      setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: true } : c))
    })
    const offlineCleanup = on('user:offline', ({ userId: uid }) => {
      setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: false } : c))
    })
    return () => { onlineCleanup(); offlineCleanup() }
  }, [on])

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
      }
    })
  }, [activeContactId, emit])

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
  }, [loadHistory])

  return (
    <MessageContext.Provider value={{
      contacts,
      messages,
      activeContactId,
      connected,
      userId,
      sendTextMessage,
      openConversation,
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
