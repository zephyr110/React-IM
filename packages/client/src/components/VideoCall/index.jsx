import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledVideoCall, { Actions, Minimize, Action, Self, VideoCallAlert } from './style'
import videoCaller from 'assets/images/paper-3.jpg'
import { Mic, Minimize2, PhoneOff, VolumeX, Video } from 'lucide-react'
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
                <Video className="w-5 h-5"
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
                <Minimize2 className="w-5 h-5" />
            </Minimize>
            <Actions>
                <Action>
                    <Mic className="w-5 h-5" />
                </Action>
                <Action type='hangoff'>
                    <PhoneOff className="w-5 h-5" onClick={onHangOffClick} />
                </Action>
                <Action>
                    <VolumeX className="w-5 h-5" />
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
