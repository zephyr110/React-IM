import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Loader2, ChevronLeft } from 'lucide-react'
import { useSocket } from 'context/SocketContext'

const API = 'http://localhost:4000'

function Login ({ onLogin, onSwitchToRegister }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: socketLogin } = useSocket()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !password.trim()) { setError('请输入用户名和密码'); return }
    if (password.length < 4) { setError('密码至少4位'); return }

    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || '登录失败'); setLoading(false); return }
      socketLogin({ id: data.id, name: data.name, avatar: data.avatar || 'avatar-1' })
      onLogin(data)
    } catch { setError('网络错误，请确认服务器已启动') }
    setLoading(false)
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      {/* Left panel - branding */}
      <div className='hidden lg:flex flex-col justify-between bg-muted/50 p-10'>
        <div className='flex items-center gap-2 text-lg font-medium'>
          <img src='/logo.svg' alt='Echo' className='w-8 h-8 dark:invert' />
          Echo
        </div>
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold leading-tight'>
            实时通讯，即刻连接
          </h2>
          <p className='text-muted-foreground text-sm leading-relaxed max-w-sm'>
            支持文字消息、语音消息、图片发送、表情符号的即时通讯应用。
            安全、快速、跨平台。
          </p>
        </div>
        <div className='text-xs text-muted-foreground'>
          © 2026 Echo
        </div>
      </div>

      {/* Right panel - form */}
      <div className='flex items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm'>
          {/* Mobile back + logo */}
          <div className='lg:hidden mb-8'>
            <div className='flex items-center gap-2 text-lg font-medium'>
              <img src='/logo.svg' alt='Echo' className='w-8 h-8 dark:invert' />
              Echo
            </div>
          </div>

          <Card className='border-0 shadow-none sm:border sm:shadow-sm'>
            <CardHeader className='space-y-1 text-center sm:text-left'>
              <CardTitle className='text-2xl'>欢迎回来</CardTitle>
              <CardDescription>输入你的账号信息登录</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>用户名</Label>
                  <Input
                    id='name'
                    placeholder='请输入用户名'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    autoFocus
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='password'>密码</Label>
                  </div>
                  <Input
                    id='password'
                    type='password'
                    placeholder='请输入密码'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={50}
                  />
                </div>
                {error && <p className='text-sm text-destructive'>{error}</p>}
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                  登录
                </Button>
              </form>

              <div className='mt-6 text-center text-sm'>
                还没有账号？{' '}
                <button type='button' onClick={onSwitchToRegister} className='text-primary hover:underline font-medium'>
                  立即注册
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Register ({ onLogin, onBack }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: socketLogin } = useSocket()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !password.trim()) { setError('请填写所有字段'); return }
    if (password.length < 4) { setError('密码至少4位'); return }
    if (password !== confirm) { setError('两次密码不一致'); return }

    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || '注册失败'); setLoading(false); return }
      socketLogin({ id: data.id, name: data.name, avatar: data.avatar || 'avatar-1' })
      onLogin(data)
    } catch { setError('网络错误，请确认服务器已启动') }
    setLoading(false)
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='hidden lg:flex flex-col justify-between bg-muted/50 p-10'>
        <div className='flex items-center gap-2 text-lg font-medium'>
          <img src='/logo.svg' alt='Echo' className='w-8 h-8 dark:invert' />
          Echo
        </div>
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold leading-tight'>
            加入我们，开始聊天
          </h2>
          <p className='text-muted-foreground text-sm leading-relaxed max-w-sm'>
            创建你的账号，与朋友、同事实时沟通。
          </p>
        </div>
        <div className='text-xs text-muted-foreground'>© 2026 Echo</div>
      </div>

      <div className='flex items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm'>
          <div className='lg:hidden mb-8'>
            <button onClick={onBack} className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4'>
              <ChevronLeft className='w-4 h-4' /> 返回登录
            </button>
            <div className='flex items-center gap-2 text-lg font-medium'>
              <img src='/logo.svg' alt='Echo' className='w-8 h-8 dark:invert' />
              Echo
            </div>
          </div>

          <Card className='border-0 shadow-none sm:border sm:shadow-sm'>
            <CardHeader className='space-y-1 text-center sm:text-left'>
              <div className='hidden lg:block'>
                <button onClick={onBack} className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2'>
                  <ChevronLeft className='w-4 h-4' /> 返回登录
                </button>
              </div>
              <CardTitle className='text-2xl'>创建账号</CardTitle>
              <CardDescription>填写信息注册新账号</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='reg-name'>用户名</Label>
                  <Input id='reg-name' placeholder='请输入用户名' value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoFocus />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='reg-password'>密码</Label>
                  <Input id='reg-password' type='password' placeholder='至少4位密码' value={password} onChange={(e) => setPassword(e.target.value)} maxLength={50} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='reg-confirm'>确认密码</Label>
                  <Input id='reg-confirm' type='password' placeholder='再次输入密码' value={confirm} onChange={(e) => setConfirm(e.target.value)} maxLength={50} />
                </div>
                {error && <p className='text-sm text-destructive'>{error}</p>}
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                  注册
                </Button>
              </form>

              <div className='mt-6 text-center text-sm'>
                已有账号？{' '}
                <button onClick={onBack} className='text-primary hover:underline font-medium'>返回登录</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AuthPage ({ onLogin }) {
  const [mode, setMode] = useState('login')

  return mode === 'login'
    ? <Login onLogin={onLogin} onSwitchToRegister={() => setMode('register')} />
    : <Register onLogin={onLogin} onBack={() => setMode('login')} />
}

export default AuthPage
