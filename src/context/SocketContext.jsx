import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

const SocketContext = createContext(null)

export function SocketProvider ({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id)
      setConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected:', reason)
      setConnected(false)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [])

  const login = useCallback((user) => {
    const id = user.id || `user-${Date.now()}`
    setUserId(id)
    socketRef.current?.emit('login', {
      userId: id,
      name: user.name,
      avatar: user.avatar,
    })
    return id
  }, [])

  const emit = useCallback((event, data, callback) => {
    if (callback) {
      socketRef.current?.emit(event, data, callback)
    } else {
      socketRef.current?.emit(event, data)
    }
  }, [])

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler)
    return () => socketRef.current?.off(event, handler)
  }, [])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, userId, login, emit, on }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket () {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}
