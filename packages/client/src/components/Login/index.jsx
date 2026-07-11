import React, { useState } from 'react'
import StyledLogin from './style'
import Button from 'components/Button'
import Input from 'components/Input'
import { useSocket } from 'context/SocketContext'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'

const AVATAR_MAP = { 'avatar-1': avatarImg1, 'avatar-2': avatarImg2 }

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
        <StyledLogin>
            <div className="login-card">
                <h1>React IM</h1>
                <p>输入昵称开始聊天</p>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="你的昵称"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                    />
                    <div className="avatar-select">
                        {Object.entries(AVATAR_MAP).map(([key, src]) => (
                            <img
                                key={key}
                                src={src}
                                alt={key}
                                className={avatar === key ? 'selected' : ''}
                                onClick={() => setAvatar(key)}
                            />
                        ))}
                    </div>
                    <Button type="submit" shape="rect" disabled={!name.trim()}>
                        进入聊天
                    </Button>
                </form>
            </div>
        </StyledLogin>
    )
}

export default Login
