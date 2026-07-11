import React from 'react'
import PropTypes from 'prop-types'
import StyledTitleBar, { Title, Actions } from './style'
import Avatar from 'components/Avatar'
import avatarImg from 'assets/images/avatar.jpg'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'
import Paragraph from 'components/Paragraph'
import Text from 'components/Text'
import Icon from 'components/Icon'
import Call from 'assets/icons/call.svg?react'
import Camera from 'assets/icons/camera.svg?react'
import Options from 'assets/icons/options.svg?react'
import Dropdown from 'components/Dropdown'
import { DropdownItem } from 'components/Dropdown/style'
import Seperator from 'components/Seperator'
import { useMessages } from 'context/MessageContext'
import useBlockedList from 'hooks/useBlockedList'
import { useToast } from 'hooks/useToast'

function getAvatarSrc(avatar) {
    const map = {
        'avatar-1': avatarImg1,
        'avatar-2': avatarImg2,
    }
    return map[avatar] || avatarImg
}

function TitleBar ({
    onAvatarClick,
    onVideoClick,
    onCloseConversation,
    titleBarAnimation,
    style,
    children,
    ...rest
}) {
    const { contacts, activeContactId } = useMessages()
    const { blockContact } = useBlockedList()
    const { showToast } = useToast()
    const activeContact = contacts.find(c => c.id === activeContactId)

    const handleProfile = () => {
        onAvatarClick && onAvatarClick()
    }

    const handleClose = () => {
        onCloseConversation && onCloseConversation()
    }

    const handleBlock = () => {
        if (activeContactId) {
            blockContact(activeContactId)
            showToast(`已屏蔽 ${activeContact?.name || activeContactId}`, 'warning')
            onCloseConversation && onCloseConversation()
        }
    }

    return (
        <StyledTitleBar style={{ ...style, ...titleBarAnimation}} {...rest}>
            <Avatar
                onClick={onAvatarClick}
                status={activeContact?.online ? 'online' : 'offline'}
                src={getAvatarSrc(activeContact?.avatar)}
            />
            <Title>
                <Paragraph size='large'>{activeContact?.name || '选择联系人'}</Paragraph>
                <Paragraph type='secondary'>
                    <Text>{activeContact?.online ? '在线' : '离线'}</Text>
                    {activeContact && <Text> · 最后阅读：3小时前</Text>}
                </Paragraph>
            </Title>
            <Actions>
                <Icon opacity={0.5} icon={Call} />
                <Icon opacity={0.5} icon={Camera} onClick={onVideoClick} />
                <Dropdown
                    content={
                        <>
                            <DropdownItem onClick={handleProfile}>
                                <Paragraph>个人资料</Paragraph>
                            </DropdownItem>
                            <DropdownItem onClick={handleClose}>
                                <Paragraph>关闭会话</Paragraph>
                            </DropdownItem>
                            <Seperator />
                            <DropdownItem onClick={handleBlock}>
                                <Paragraph type='danger'>屏蔽此人</Paragraph>
                            </DropdownItem>
                        </>
                    }
                >
                    <Icon opacity={0.5} icon={Options} />
                </Dropdown>
            </Actions>
        </StyledTitleBar>
    )
}

TitleBar.propTypes = {
    children: PropTypes.any,
    onAvatarClick: PropTypes.func,
    onVideoClick: PropTypes.func,
    onCloseConversation: PropTypes.func,
    titleBarAnimation: PropTypes.object,
    style: PropTypes.object,
}

export default TitleBar
