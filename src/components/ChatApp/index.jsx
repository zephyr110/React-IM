import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledChatApp, { Nav, Sidebar, Content, Drawer } from './style'
import NavBar from 'components/NavBar'
import MessageList from 'components/MessageList'
import Conversation from 'components/Conversation'
import Profile from 'components/Profile'
import { Route, Switch, useLocation } from 'react-router-dom'
import ConcatList from 'components/ConcatList'
import FileList from 'components/FileList'
import NoteList from 'components/NoteList'
import EditProfile from 'components/EditProfile'
import Settings from 'components/Settings'
import BlockedList from 'components/BlockedList'
import VedioCall from 'components/VedioCall'
import { useTransition, animated } from 'react-spring'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'
function ChatApp ({ children, ...rest }) {
    const [showDrawer, setShowDrawer] = useState(false)
    const [videoCalling, setVideoCalling] = useState(false)

    // 路由切换过度效果
    const location = useLocation()
    const getFirstSgmPath = (location) => location.pathname.split('/')[1]
    const transitions = useTransition(location, getFirstSgmPath, {
        from: { opacity: 0, transform: 'translated3d(-100px, 0, 0)' },
        enter: { opacity: 1, transform: 'translated3d(0, 0, 0)' },
        leave: { opacity: 0, transform: 'translated3d(-100px, 0, 1)' }
    })

    return (
        <StyledChatApp {...rest}>
            {children}
            <Nav>
                <NavBar />
            </Nav>
            <Sidebar>
                {transitions.map(({ item: location, props, key }) => (
                    <animated.div key={key} style={props}>
                        <Switch location={location}>
                            <Route exact path='/'>
                                <MessageList />
                            </Route>
                            <Route exact path='/contcats'>
                                <ConcatList />
                            </Route>
                            <Route exact path='/files'>
                                <FileList />
                            </Route>
                            <Route exact path='/notes'>
                                <NoteList />
                            </Route>
                            <Route path='/settings'>
                                <EditProfile src={avatarImg1} />
                            </Route>
                        </Switch>
                    </animated.div>
                ))}
            </Sidebar>
            <Content>
                {videoCalling && <VedioCall onHangOffClick={() => setVideoCalling(false)} />}
                <Switch>
                    <Route exact path='/settings'>
                        <Settings />
                    </Route>
                    <Route exact path='/settings/blocked' >
                        <BlockedList />
                    </Route>
                    <Route path='/'>
                        <Conversation
                            onAvatarClick={() => setShowDrawer(true)}
                            onVideoClick={() => setVideoCalling(true)}
                        />
                    </Route>
                </Switch>
            </Content>
            <Drawer show={showDrawer}>
                <Profile src={avatarImg2} name={'林凌'} onCloseClick={() => setShowDrawer(false)} />
            </Drawer>
        </StyledChatApp >
    )
}

ChatApp.propTypes = {
    children: PropTypes.any
}

export default ChatApp


