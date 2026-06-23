
import React from 'react'
import ChatBubble from '.'
import VoiceMessage from 'components/VoiceMessage'
import Emoji from 'components/Emoji'

export default {
    title: 'UI组件/ ChatBubble',
    component: ChatBubble
}

export const FromOthers = () => {
    return <ChatBubble time='昨天 下午14:26'>这是一条其他人发送的聊天信息</ChatBubble>
}

export const Mine = () => {
    return (
        <ChatBubble type='mine' time='昨天 下午14:26'>
            这是一条我发送的聊天信息<Emoji label='smile'> 😊 </Emoji>
        </ChatBubble>
    )
}


export const VoiceMessageType = () => {
    return (
        <ChatBubble time='昨天 下午14:26'>
            <VoiceMessage time='01:25' />
        </ChatBubble>
    )
}

export const VoiceMessageTypeMine = () => {
    return (
        <ChatBubble type='mine' time='昨天 下午14:26'>
            <VoiceMessage type='mine' time='01:25' />
        </ChatBubble>
    )
}
