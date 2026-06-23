import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledVideoCall, { Actions, Minimize, Action, Self, VideoCallAlert } from './style'
import videoCaller from 'assets/images/paper-3.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faCompressAlt, faPhoneSlash, faVolumeMute, faVideo } from '@fortawesome/free-solid-svg-icons'
import Avatar from 'components/Avatar'
import Paragraph from 'components/Paragraph'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'
import Text from 'components/Text'
function VideoCall ({ onHangOffClick, children, ...rest }) {
    const [fullScreen, setFullScreen] = useState(true)

    if (!fullScreen) {
        return (
            <VideoCallAlert>
                <Avatar
                    src={avatarImg2}
                    css={`
                        grid-area: avatar;
                    `}
                />
                <Paragraph
                    size='normal'
                    css={`
                        grid-area: info;
                    `}
                >正在跟<Text bold={'bold'} size={'normal'} style={{ color: '#4f9dde' }}> 林凌 </Text>进行视频通话</Paragraph>
                <Paragraph
                    type='secondary'
                    css={`
                        grid-area: action;
                        cursor: pointer;
                    `}
                    onClick={() => setFullScreen(true)}
                >点击切换全屏</Paragraph>
                <FontAwesomeIcon
                    icon={faVideo}
                    css={`
                        grid-area: icon;
                        font-size: 20px;
                        justify-self: end;
                        opacity: 0.3;
                    `}
                />
            </VideoCallAlert>
        )
    }

    return (
        <StyledVideoCall src={videoCaller} {...rest}>
            <Minimize shape='rect' onClick={() => setFullScreen(false)}>
                <FontAwesomeIcon icon={faCompressAlt} />
            </Minimize>
            <Actions>
                <Action>
                    <FontAwesomeIcon icon={faMicrophone} />
                </Action>
                <Action type='hangoff'>
                    <FontAwesomeIcon icon={faPhoneSlash} onClick={onHangOffClick} />
                </Action>
                <Action>
                    <FontAwesomeIcon icon={faVolumeMute} />
                </Action>
            </Actions>
            <Self size='140px' src={avatarImg1} />

            {children}
        </StyledVideoCall>
    )
}

VideoCall.propTypes = {
    children: PropTypes.any
}

export default VideoCall
