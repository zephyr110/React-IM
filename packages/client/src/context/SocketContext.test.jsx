import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock socket.io-client: simulate connect event immediately
const mockSocket = {
  on: vi.fn((event, handler) => {
    if (event === 'connect') {
      // Fire connect handler synchronously
      handler()
    }
  }),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
  connect: vi.fn(),
  id: 'mock-socket-id',
}

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}))

import { SocketProvider, useSocket } from './SocketContext'

describe('SocketContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws error when useSocket is used outside SocketProvider', () => {
    const { result } = renderHook(() => {
      try {
        return useSocket()
      } catch (e) {
        return e
      }
    })
    expect(result.current).toBeInstanceOf(Error)
    expect(result.current.message).toContain('useSocket must be used within SocketProvider')
  })

  it('provides socket context values', async () => {
    const wrapper = ({ children }) => <SocketProvider>{children}</SocketProvider>
    const { result } = renderHook(() => useSocket(), { wrapper })

    expect(result.current).toBeDefined()
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.emit).toBe('function')
    expect(typeof result.current.on).toBe('function')
    // connected should be true because we fire connect synchronously
    await waitFor(() => {
      expect(result.current.connected).toBe(true)
    })
  })

  it('login method emits login event and returns userId', () => {
    const wrapper = ({ children }) => <SocketProvider>{children}</SocketProvider>
    const { result } = renderHook(() => useSocket(), { wrapper })

    let userId
    act(() => {
      userId = result.current.login({ name: 'TestUser', avatar: 'avatar-1' })
    })

    expect(mockSocket.emit).toHaveBeenCalledWith('login', {
      userId: expect.any(String),
      name: 'TestUser',
      avatar: 'avatar-1',
    })
    expect(userId).toBeDefined()
  })

  it('emit method sends events to socket', () => {
    const wrapper = ({ children }) => <SocketProvider>{children}</SocketProvider>
    const { result } = renderHook(() => useSocket(), { wrapper })

    act(() => {
      result.current.emit('message:send', { to: '2', content: 'hello' })
    })

    expect(mockSocket.emit).toHaveBeenCalledWith('message:send', { to: '2', content: 'hello' })
  })

  it('emit method with callback uses ack pattern', () => {
    const wrapper = ({ children }) => <SocketProvider>{children}</SocketProvider>
    const { result } = renderHook(() => useSocket(), { wrapper })
    const callback = vi.fn()

    act(() => {
      result.current.emit('message:send', { to: '2' }, callback)
    })

    expect(mockSocket.emit).toHaveBeenCalledWith('message:send', { to: '2' }, callback)
  })

  it('on method registers listener and returns cleanup function', () => {
    const wrapper = ({ children }) => <SocketProvider>{children}</SocketProvider>
    const { result } = renderHook(() => useSocket(), { wrapper })
    const handler = vi.fn()

    let cleanup
    act(() => {
      cleanup = result.current.on('message:new', handler)
    })

    expect(mockSocket.on).toHaveBeenCalledWith('message:new', handler)

    act(() => {
      cleanup()
    })

    expect(mockSocket.off).toHaveBeenCalledWith('message:new', handler)
  })
})
