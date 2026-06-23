
import React from 'react'
import Select from '.';
import Option from 'components/Option';

export default {
    title: 'UI组件 /Input / Select',
    component: Select
}

export const Default = () => {
    return (
        <Select>
            <Option>Option 1</Option>
            <Option>Option 2</Option>
            <Option>Option 3</Option>
        </Select>
    )
}

export const FormSelect = () => {
    return (
        <Select type='form'>
            <Option>Option A</Option>
            <Option>Option B</Option>
            <Option>Option C</Option>
        </Select>
    )
}
