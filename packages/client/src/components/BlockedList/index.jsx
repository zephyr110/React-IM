import React from 'react'
import PropTypes from 'prop-types'
import StyledBlockedList, { SettingsMenu, ClosableAvatar, BlockedAvatar, BlockedName, FriendList } from './style'
import Text from 'components/Text'
import { ArrowLeft, XCircle } from 'lucide-react'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import { useNavigate } from 'react-router-dom'

function BlockedList ({ children, ...rest }) {
    const navigate = useNavigate()

    return (
        <StyledBlockedList {...rest}>
            <SettingsMenu>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5 opacity-50" />
                </button>
                <Text size='xlarge'>已屏蔽的好友</Text>
            </SettingsMenu>
            <FriendList>
                {new Array(8).fill(0).map((_, i) => {
                    return (
                        <ClosableAvatar key={i}>
                            <BlockedAvatar size='105px' src={avatarImg1} />
                            <XCircle className="w-[46px] h-[51px] text-destructive cursor-pointer" style={{ gridArea: '2 / 3 / 5 / 4', zIndex: 10, marginTop: '10px' }} />
                            <BlockedName>楚中天</BlockedName>
                        </ClosableAvatar>
                    )
                })}
            </FriendList>
        </StyledBlockedList>
    )
}

BlockedList.propTypes = {
    children: PropTypes.any
}

export default BlockedList


