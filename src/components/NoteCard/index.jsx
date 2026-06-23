
import React from 'react'
import PropTypes from 'prop-types'
import StyledNoteCard, { NoteImage, NoteTitle, NoteExcerpt, NotePublishTime } from './style'
import note1 from 'assets/images/paper-7.jpg'

function NoteCard ({ children, ...rest }) {
    return (
        <StyledNoteCard {...rest}>
            <NoteImage src={note1} />
            <NoteTitle>笔记标题</NoteTitle>
            <NoteExcerpt> Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi facilis aliquid unde in quos temporibus ea maxime, fugit odit atque.</NoteExcerpt>
            <NotePublishTime>2020-6-22</NotePublishTime>
            {children}
        </StyledNoteCard>
    )
}

NoteCard.propTypes = {
    children: PropTypes.any
}

export default NoteCard


