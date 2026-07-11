
import React from 'react'
import Button from '.'
import Icon from 'components/Icon'
import Plus from 'assets/icons/plus.svg?react'

export default {
    title: 'UI组件/ Button',
    component: Button
}

export const Default = () => {
    return <Button shape='rect'> 默认按钮 </Button>
}

export const CircleButton = () => {
    return (
        <Button>
            <Icon icon={Plus} width={12} height={12}/>
        </Button>
    )
}
