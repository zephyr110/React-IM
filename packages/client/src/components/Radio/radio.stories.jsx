
import React from 'react'
import Radio from '.'

export default {
    title: 'UI组件/ Radio',
    component: Radio
}

export const Default = () => {
    return <Radio> option A </Radio>
}

export const RadioGroup = () => {
    return (
        <Radio.Group label='请选择'>
            <Radio name='option'>option A</Radio>
            <Radio name='option'>option B</Radio>
            <Radio name='option'>option C</Radio>
        </Radio.Group>
    )
}
