import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { MessageCircle, Users, FolderOpen, StickyNote, Settings, MoreHorizontal } from 'lucide-react'
import avatarImg1 from 'assets/images/avatar-1.jpg'

const NAV_ITEMS = [
  { to: '/', icon: MessageCircle, label: '消息' },
  { to: '/contacts', icon: Users, label: '联系人' },
  { to: '/files', icon: FolderOpen, label: '文件' },
  { to: '/notes', icon: StickyNote, label: '笔记' },
  { to: '/more', icon: MoreHorizontal, label: '更多' },
]

function NavBar () {
  const location = useLocation()

  return (
    <nav className='flex flex-col items-center h-full py-4 px-2 gap-1 bg-secondary/30 border-r'>
      {/* User avatar */}
      <div className='mb-4'>
        <Avatar className='w-11 h-11 ring-2 ring-primary/20'>
          <AvatarImage src={avatarImg1} alt='avatar' />
        </Avatar>
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

      {/* Settings at bottom */}
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
    </nav>
  )
}

export default NavBar
