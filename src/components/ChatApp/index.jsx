import React, { useState } from 'react'
import StyledChatApp, { Nav, Sidebar, Content, Drawer } from './style'
import NavBar from 'components/NavBar'
import MessageList from 'components/MessageList'
import Conversation from 'components/Conversation'
import Profile from 'components/Profile'
import { Routes, Route, useLocation } from 'react-router-dom'
import ConcatList from 'components/ConcatList'
import FileList from 'components/FileList'
import NoteList from 'components/NoteList'
import EditProfile from 'components/EditProfile'
import Settings from 'components/Settings'
import BlockedList from 'components/BlockedList'
import VideoCall from 'components/VideoCall'
import { useTransition, animated } from 'react-spring'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'

function ChatApp ({ children, ...rest }) {
    const [showDrawer, setShowDrawer] = useState(false)
    const [videoCalling, setVideoCalling] = useState(false)

    const location = useLocation()
    const getFirstSgmPath = (location) => location.pathname.split('/')[1]
    const transitions = useTransition(location, {
        keys: getFirstSgmPath,
        from: { opacity: 0, transform: 'translate3d(-100px, 0, 0)' },
        enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        leave: { opacity: 0, transform: 'translate3d(-100px, 0, 1)' }
    })

    return (
        <StyledChatApp {...rest}>
            <Nav>
                <NavBar />
            </Nav>
            <Sidebar>
                {transitions((style, item) => (
                    <animated.div style={style}>
                        <Routes location={item}>
                            <Route path="/" element={<MessageList />} />
                            <Route path="/contacts" element={<ConcatList />} />
                            <Route path="/files" element={<FileList />} />
                            <Route path="/notes" element={<NoteList />} />
                            <Route path="/settings" element={<EditProfile src={avatarImg1} />} />
                        </Routes>
                    </animated.div>
                ))}
            </Sidebar>
            <Content>
                {videoCalling && <VideoCall onHangOffClick={() => setVideoCalling(false)} />}
                <Routes>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/blocked" element={<BlockedList />} />
                    <Route path="/*" element={
                        <Conversation
                            onAvatarClick={() => setShowDrawer(true)}
                            onVideoClick={() => setVideoCalling(true)}
                        />
                    } />
                </Routes>
            </Content>
            <Drawer show={showDrawer}>
                <Profile src={avatarImg2} name={'林凌'} onCloseClick={() => setShowDrawer(false)} />
            </Drawer>
        </StyledChatApp >
    )
}

export default ChatApp
