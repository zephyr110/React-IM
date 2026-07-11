import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import StyledMessageList, { ChatList } from './style'
import MessageCard from 'components/MessageCard'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'
import FilterList from 'components/FilterList'
import { animated } from 'react-spring'
import useStaggeredList from 'hooks/useStaggeredList'
import { useMessages } from 'context/MessageContext'

function getAvatarSrc(avatar) {
    return avatar === 'avatar-2' ? avatarImg2 : avatarImg1
}

function MessageList ({ children, ...rest }) {
    const { contacts, activeContactId, openConversation, messages, unreadCounts } = useMessages()
    const [searchText, setSearchText] = useState('')

    const filteredContacts = useMemo(() => {
        if (!searchText.trim()) return contacts
        const keyword = searchText.trim().toLowerCase()
        return contacts.filter(contact => {
            if (contact.name.toLowerCase().includes(keyword)) return true
            const contactMsgs = messages[contact.id] || []
            return contactMsgs.some(m =>
                m.type === 'text' && m.content.toLowerCase().includes(keyword)
            )
        })
    }, [contacts, messages, searchText])

    const trailAnimation = useStaggeredList(filteredContacts.length || 1)

    return (
        <StyledMessageList {...rest}>
            <FilterList
                options={['最新消息优先', '在线好友优先']}
                actionLabel='创建会话'
                onSearch={setSearchText}
            >
                <ChatList>
                    {filteredContacts.map((contact, index) => {
                        const contactMsgs = messages[contact.id] || []
                        const lastMsg = contactMsgs[contactMsgs.length - 1]
                        return (
                            <animated.div key={contact.id} style={trailAnimation[index]}>
                                <MessageCard
                                    key={contact.id}
                                    active={contact.id === activeContactId}
                                    replied={false}
                                    avatarSrc={getAvatarSrc(contact.avatar)}
                                    name={contact.name}
                                    avatarStatus={contact.online ? 'online' : 'offline'}
                                    statusText={contact.online ? '在线' : '离线'}
                                    time={lastMsg?.time || ''}
                                    message={lastMsg?.content || contact.lastMessage || ''}
                                    unreadCount={unreadCounts?.[contact.id] || 0}
                                    onClick={() => openConversation(contact.id)}
                                />
                            </animated.div>
                        )
                    })}
                </ChatList>
            </FilterList>
        </StyledMessageList>
    )
}

MessageList.propTypes = {
    children: PropTypes.any
}
export default MessageList
