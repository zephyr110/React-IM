import React from 'react'
import PropTypes from 'prop-types'
import StyledConcatCard, { Intro } from './style'
import Avatar from 'components/Avatar'
import { Name } from 'components/MessageCard/style'
import avatarImg from 'assets/images/avatar.jpg'

function ConcatCard ({children, ...rest}) {
    return (
        <StyledConcatCard {...rest}>
            <Avatar src={avatarImg} status='online' />
            <Name>楚中天</Name>
            <Intro>前端工程师</Intro>
            {children}
        </StyledConcatCard>
    )
}

ConcatCard.propTypes = {
    children: PropTypes.any
}

export default ConcatCard


