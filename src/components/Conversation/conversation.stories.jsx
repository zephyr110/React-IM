
import React from 'react'
import Conversation from '.'

export default {
    title: '页面组件/ Conversation',
    component: Conversation
}

export const Default = () => {
    return (
        <div style={{ width: '90%', margin: '0 auto' }} >
            <Conversation />
        </div >
    )
}

