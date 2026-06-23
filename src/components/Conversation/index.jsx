import React from 'react'
import PropTypes from 'prop-types'
import StyledConversation, { Conversations, MyChatBubble } from './style'
import TitleBar from 'components/TitleBar'
import ChatBubble from 'components/ChatBubble'
import VoiceMessage from 'components/VoiceMessage'
import Emoji from 'components/Emoji'
import Footer from 'components/Footer'
import { useSpring } from 'react-spring'


function Conversation ({ onAvatarClick, onVideoClick, children, ...rest }) {
    const titleBarAnimation = useSpring({
        opacity: 1,
        transform: 'translated3s(0px, 0px, 0px)',
        from: { opacity: 0, transform: 'translated3d(0px, -50px, 0px)' },
        delay: 300,
    })

    const coversationAnimation = useSpring({
        opacity: 1,
        transform: 'translated3s(0px, 0px, 0px)',
        from: { opacity: 0, transform: 'translated3d(50px, 0px, 0px)' },
        delay: 450,
    })

    const footerAnimation = useSpring({
        opacity: 1,
        transform: 'translated3s(0px, 0px, 0px)',
        from: { opacity: 0, transform: 'translated3d(0px, 50px, 0px)' },
        delay: 600,
    })

    return (
        <StyledConversation {...rest}>
            <TitleBar
                onAvatarClick={onAvatarClick}
                onVideoClick={onVideoClick}
                titleBarAnimation={titleBarAnimation}
            />
            <Conversations style={coversationAnimation}>
                <ChatBubble time='昨天 下午14:26'> Hi～ 小天，忙什么呢？ </ChatBubble>
                <MyChatBubble time='昨天 下午14:28'> 忙着写Bug呢 </MyChatBubble>
                <ChatBubble time='昨天 下午14:38'>
                    <VoiceMessage time='01:15' />
                </ChatBubble>
                <MyChatBubble time='昨天 下午14:42'>
                    本来是一个，改着改着多了4个，脑壳疼～
                     {/* eslint-disable jsx-a11y/accessible-emoji */}
                     <Emoji label='smile'> 😂😂😂 </Emoji>
                </MyChatBubble>
            </Conversations>
            <Footer footerAnimation={footerAnimation} />
        </StyledConversation>
    )
}

Conversation.propTypes = {
    children: PropTypes.any
}

export default Conversation


