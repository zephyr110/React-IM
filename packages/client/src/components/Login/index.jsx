import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSocket } from 'context/SocketContext'
import { MessageCircle } from 'lucide-react'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'

const AVATARS = [
  { key: 'avatar-1', src: avatarImg1, label: '👦' },
  { key: 'avatar-2', src: avatarImg2, label: '👧' },
]

function Login ({ onLogin }) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('avatar-1')
  const { login } = useSocket()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const userId = login({ name: name.trim(), avatar })
    onLogin({ id: userId, name: name.trim(), avatar })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4'>
      <Card className='w-full max-w-sm shadow-lg animate-fade-in'>
        <CardHeader className='text-center space-y-3'>
          <div className='mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center'>
            <MessageCircle className='w-6 h-6 text-primary-foreground' />
          </div>
          <div>
            <CardTitle className='text-2xl'>React IM</CardTitle>
            <CardDescription className='mt-1'>输入昵称开始聊天</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <Input
              placeholder='你的昵称'
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className='h-11'
            />
            <div className='flex gap-3 justify-center'>
              {AVATARS.map(({ key, src, label }) => (
                <button
                  key={key}
                  type='button'
                  onClick={() => setAvatar(key)}
                  className='p-1 rounded-full transition-all'
                  style={{
                    boxShadow: avatar === key ? '0 0 0 3px hsl(var(--primary))' : '0 0 0 2px transparent'
                  }}
                >
                  <Avatar className='w-16 h-16'>
                    <AvatarImage src={src} alt={key} />
                    <AvatarFallback>{label}</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full h-11' disabled={!name.trim()}>
              进入聊天
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
