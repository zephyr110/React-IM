import React from 'react'
import PropTypes from 'prop-types'
import StyledConcatCard, { Intro, Name } from './style'
import Avatar from 'components/Avatar'
import avatarImg from 'assets/images/avatar.jpg'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'

function getAvatarSrc(avatar) {
    const map = {
        'avatar-1': avatarImg1,
        'avatar-2': avatarImg2,
    }
    return map[avatar] || avatarImg
}

function ConcatCard ({ avatar, name, intro, status, onClick, children, ...rest }) {
    return (
        <StyledConcatCard onClick={onClick} {...rest}>
            <Avatar src={getAvatarSrc(avatar)} status={status} />
            <Name>{name}</Name>
            <Intro>{intro}</Intro>
            {children}
        </StyledConcatCard>
    )
}

ConcatCard.propTypes = {
    children: PropTypes.any,
    avatar: PropTypes.string,
    name: PropTypes.string,
    intro: PropTypes.string,
    status: PropTypes.string,
    onClick: PropTypes.func,
}

export default ConcatCard


