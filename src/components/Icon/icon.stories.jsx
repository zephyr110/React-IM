
import React from 'react'
import Icon from '.';
import SmileIcon from 'assets/icons/smile.svg?react'
import 'story.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faStickyNote, faFolderOpen } from '@fortawesome/free-solid-svg-icons'

export default {
    title: 'UI组件/ Icon',
    component: Icon
}

export const Default = () => {
    return <Icon icon={SmileIcon} />
}

export const CustomColor = () => {
    return <Icon icon={SmileIcon} color='#000' />
}

export const CustomSize = () => {
    return <Icon icon={SmileIcon} color='#000' width={48} height={48} />
}

export const FontAwesome = () => {
    return <FontAwesomeIcon icon={faCommentDots} />
}

export const FontAwesomeColor = () => {
    return <FontAwesomeIcon icon={faCommentDots} style={{ color: '#ccc' }} />
}

export const FontAwesomeSize = () => {
    return (
        <div className='row-elements'>
            <div><FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: '24px' }} /></div>
            <div><FontAwesomeIcon icon={faStickyNote} style={{ fontSize: '36px' }} /></div>
            <div><FontAwesomeIcon icon={faCommentDots} style={{ fontSize: '52px' }} /></div>
        </div>
    )
}
