import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock socket context
const mockLogin = vi.fn((user) => `mock-id-${user.name}`)
vi.mock('context/SocketContext', () => ({
  useSocket: () => ({
    login: mockLogin,
    connected: true,
    emit: vi.fn(),
    on: vi.fn(),
  }),
  SocketProvider: ({ children }) => children,
}))

// Mock image imports
vi.mock('assets/images/avatar-1.jpg', () => ({ default: 'avatar-1.jpg' }))
vi.mock('assets/images/avatar-2.jpg', () => ({ default: 'avatar-2.jpg' }))

// Mock theme import used by styled-components ThemeProvider
vi.mock('theme', () => ({
  default: {
    primaryColor: '#4f9dde',
    green: '#34d859',
    gray: 'rgba(24, 28, 47, .2)',
    red: '#f34848',
    darkPurple: '#292f4c',
    gray2: 'rgba(241, 237, 237, .3)',
    gray3: 'rgba(24, 28, 47, .3)',
    gray4: '#efece8',
    gray5: '#d8d8d8',
    grayDark: '#181c2f',
    grayDark2: 'rgba(33, 33, 33, .58)',
    background: '#ffffff',
    inactiveColor: 'rgba(41, 47, 76, 0.3)',
    inactiveColorDark: '#ffffff',
    normal: '1.4rem',
    medium: '1.6rem',
    large: '1.8rem',
    xlarge: '2rem',
    xxlarge: '2.4rem',
    small: '1.2rem',
    xsmall: '1rem',
    xxsmall: '0.8rem',
  },
}))

import Login from 'components/Login/index'

describe('Login Component', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form', () => {
    render(<Login onLogin={mockOnLogin} />)

    expect(screen.getByText('React IM')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('你的昵称')).toBeInTheDocument()
    expect(screen.getByText('进入聊天')).toBeInTheDocument()
  })

  it('shows two avatar options', () => {
    render(<Login onLogin={mockOnLogin} />)

    const avatars = screen.getAllByAltText(/avatar/)
    expect(avatars.length).toBe(2)
  })

  it('submit button is disabled when name is empty', () => {
    render(<Login onLogin={mockOnLogin} />)

    const button = screen.getByText('进入聊天')
    expect(button).toBeDisabled()
  })

  it('submit button is enabled when name is entered', () => {
    render(<Login onLogin={mockOnLogin} />)

    const input = screen.getByPlaceholderText('你的昵称')
    fireEvent.change(input, { target: { value: '小明' } })

    const button = screen.getByText('进入聊天')
    expect(button).not.toBeDisabled()
  })

  it('calls onLogin with user info on submit', () => {
    render(<Login onLogin={mockOnLogin} />)

    const input = screen.getByPlaceholderText('你的昵称')
    fireEvent.change(input, { target: { value: '小明' } })

    const button = screen.getByText('进入聊天')
    fireEvent.click(button)

    expect(mockLogin).toHaveBeenCalledWith({ name: '小明', avatar: 'avatar-1' })
    expect(mockOnLogin).toHaveBeenCalledWith({
      id: expect.any(String),
      name: '小明',
      avatar: 'avatar-1',
    })
  })

  it('does not submit with whitespace-only name', () => {
    render(<Login onLogin={mockOnLogin} />)

    const input = screen.getByPlaceholderText('你的昵称')
    fireEvent.change(input, { target: { value: '   ' } })

    const button = screen.getByText('进入聊天')
    fireEvent.click(button)

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('highlights selected avatar on click', () => {
    render(<Login onLogin={mockOnLogin} />)

    const avatars = screen.getAllByAltText(/avatar/)
    expect(avatars[0]).toHaveClass('selected')
    expect(avatars[1]).not.toHaveClass('selected')

    fireEvent.click(avatars[1])
    expect(avatars[1]).toHaveClass('selected')
    expect(avatars[0]).not.toHaveClass('selected')
  })
})
