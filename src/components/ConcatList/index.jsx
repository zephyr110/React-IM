
import React from 'react'
import PropTypes from 'prop-types'
import StyledConcatList, { Contacts } from './style'
import FilterList from 'components/FilterList'
import ConcatCard from 'components/ConcatCard'
import useStaggeredList from 'hooks/useStaggeredList'
import { animated } from 'react-spring'
import { useMessages } from 'context/MessageContext'

function ConcatList ({ children, ...rest }) {
    const { contacts, openConversation } = useMessages()
    const trailAnimation = useStaggeredList(contacts.length || 1)

    return (
        <StyledConcatList {...rest}>
            <FilterList
                options={['新添加优先', '按姓名排序']}
                actionLabel='添加好友'
            >
                <Contacts>
                    {contacts.map((contact, index) => (
                        <animated.div key={contact.id} style={trailAnimation[index]}>
                            <ConcatCard
                                key={contact.id}
                                avatar={contact.avatar}
                                name={contact.name}
                                intro={contact.intro}
                                status={contact.online ? 'online' : 'offline'}
                                onClick={() => openConversation(contact.id)}
                            />
                        </animated.div>
                    ))}
                </Contacts>
            </FilterList>
            {children}
        </StyledConcatList>
    )
}

ConcatList.propTypes = {
    children: PropTypes.any
}

export default ConcatList


