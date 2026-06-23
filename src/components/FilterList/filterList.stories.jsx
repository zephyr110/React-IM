import React from 'react'
import FilterList from '.'

export default {
    title: '页面组件/ FilterList',
    component: FilterList
}

export const Default = () => {
    return <FilterList options={['新添加优先', '按姓名排序']}> 此处是 children list </FilterList>
}

