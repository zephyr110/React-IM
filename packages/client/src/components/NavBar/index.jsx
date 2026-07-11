import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { MessageCircle, Users, FolderOpen, StickyNote, Settings, MoreHorizontal, LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { useSocket } from 'context/SocketContext'
import useAppTheme from 'hooks/useTheme'
import avatarImg1 from 'assets/images/avatar-1.jpg'

const NAV_ITEMS = [
  { to: '/', icon: MessageCircle, label: '消息' },
  { to: '/contacts', icon: Users, label: '联系人' },
  { to: '/files', icon: FolderOpen, label: '文件' },
  { to: '/notes', icon: StickyNote, label: '笔记' },
  { to: '/more', icon: MoreHorizontal, label: '更多' },
]

const THEME_OPTIONS = [
  { key: 'system', icon: Monitor, label: '系统默认' },
  { key: 'light', icon: Sun, label: '浅色主题' },
  { key: 'dark', icon: Moon, label: '深色主题' },
]

function NavBar () {
  const location = useLocation()
  const { socket } = useSocket()
  const { theme, setTheme } = useAppTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleLogout = () => {
    if (socket) socket.disconnect()
    window.location.reload()
  }

  return (
    <nav className='flex flex-col items-center h-full py-4 px-2 gap-1 bg-secondary/30 border-r'>
      {/* Logo */}
      <div className='mb-3'>
        <img src='/logo.svg' alt='Echo' className='w-10 h-10' />
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive = to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(to)
        return (
          <Link
            key={to}
            to={to}
            title={label}
            className={cn(
              'w-11 h-11 flex items-center justify-center rounded-xl transition-all',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className='w-5 h-5' />
          </Link>
        )
      })}

      <div className='flex-1' />

      {/* Settings */}
      <Link
        to='/settings'
        title='设置'
        className={cn(
          'w-11 h-11 flex items-center justify-center rounded-xl transition-all',
          location.pathname === '/settings' || location.pathname.startsWith('/settings')
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        <Settings className='w-5 h-5' />
      </Link>

      {/* Avatar with menu */}
      <div className='relative mt-2' ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='rounded-full transition-all hover:ring-2 hover:ring-primary/50'
        >
          <Avatar className='w-11 h-11'>
            <AvatarImage src={avatarImg1} alt='avatar' />
          </Avatar>
        </button>

        {menuOpen && (
          <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-popover border rounded-xl shadow-lg py-1.5 z-50'>
            {/* Theme options */}
            <div className='px-2 py-1'>
              <p className='text-xs text-muted-foreground px-2 py-1'>主题</p>
              {THEME_OPTIONS.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2 py-1.5 text-sm rounded-md transition-colors',
                    theme === key ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className='w-4 h-4' />
                  {label}
                </button>
              ))}
            </div>
            <div className='border-t my-1' />
            {/* Logout */}
            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-accent rounded-md transition-colors'
            >
              <LogOut className='w-4 h-4' />
              退出登录
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar
