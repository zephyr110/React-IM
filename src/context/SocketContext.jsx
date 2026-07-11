import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

const SocketContext = createContext(null)

export function SocketProvider ({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [userId, setUserId] = useState(null)

  // 在 render 阶段同步创建 socket，确保子组件（MessageProvider）的 effect
  // 执行时 socketRef.current 已经指向可用的 socket 实例
  if (socketRef.current === null) {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })
    socketRef.current = socket
  }

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    const handleConnect = () => {
      console.log('[socket] connected:', socket.id)
      setConnected(true)
    }

    const handleDisconnect = (reason) => {
      console.log('[socket] disconnected:', reason)
      setConnected(false)
    }

    if (socket.connected) {
      setConnected(true)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    // 不在 cleanup 中调用 socket.disconnect()，因为 React StrictMode
    // 在开发环境下会 double-invoke effect（mount → unmount → mount），
    // disconnect() 会永久关闭重连。socket 在 render 阶段创建，生命周期
    // 与组件实例一致，浏览器关闭时 socket 会自动断开。
    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
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
    const socket = socketRef.current
    if (!socket) return () => {}
    socket.on(event, handler)
    return () => {
      socket.off(event, handler)
    }
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
