
import React from 'react'
import Text from '.';

export default {
    title: '排版/ Text',
    component: Text
}

export const Default = () => {
    return <Text> Default </Text>
}

export const Secondary = () => {
    return <Text type='secondary'> secondary文本 </Text>
}

export const Medium = () => {
    return <Text size='medium'> medium文本 </Text>
}

export const LargeAndBold = () => {
    return <Text size='large' bold> large文本, 加粗 </Text>
}

