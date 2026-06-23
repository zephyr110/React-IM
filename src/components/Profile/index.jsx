import React from 'react'
import PropTypes from 'prop-types'
import StyledProfile, { SocialLinks, ContactSection, AlbumSection, AlbumTitle, Album, Photo, CloseIcon } from './style'
import Avatar from 'components/Avatar'
import 'styled-components/macro'
// import avatarImg2 from 'assets/images/avatar-2.jpg'
import Paragraph from 'components/Paragraph'
import Emoji from 'components/Emoji'
import Icon from 'components/Icon'
import { faWeibo, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import Seperator from 'components/Seperator'
import Text from 'components/Text'
import paper1 from 'assets/images/paper-1.jpg'
import paper2 from 'assets/images/paper-2.jpg'
import paper3 from 'assets/images/paper-3.jpg'
import Cross from 'assets/icons/cross.svg?react'
import Button from 'components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

function Profile ({
    showEditBtn,
    showCloseIcon = true,
    onCloseClick,
    onEdit,
    status,
    children,
    src,
    name,
    ...rest
}) {
    return (
        <StyledProfile {...rest}>
            {showCloseIcon && <CloseIcon icon={Cross} onClick={onCloseClick} />}
            <Avatar
                css={`
                    margin: 26px 0;
                    grid-area: 1 / 1 / 3 / 2;
                `}
                src={src}
                size='160px'
                status={status}
                statusIconSize='25px'
            />
            {showEditBtn && (
                <Button
                    size='52px'
                    onClick={onEdit}
                    css={`
                        grid-area: 1 / 1 / 3 / 2;
                        align-self: end;
                        margin-left: 100px;
                        z-index: 10;
                    `}
                >
                    <FontAwesomeIcon
                        css={`
                            font-size: 24px;
                            color: #fff;
                        `}
                        icon={faPen}
                    />
                </Button>
            )}
            <Paragraph
                size='xlarge'
                css={`
                    margin-bottom: 12px;
                `}
            >
                {name}
            </Paragraph>
            <Paragraph
                size='medium'
                type='secondary'
                css={`
                    margin-bottom: 12px;
                `}
            >
                北京市 海淀区
            </Paragraph>
            <Paragraph
                css={`
                    margin-bottom: 26px;
                    text-align: center;
                `}
            >
                前端小白，努力让自己在前端的路上走更远一些{' '}
                {/* eslint-disable jsx-a11y/accessible-emoji */}
                <Emoji label='fist'> ✊ 💪 💯</Emoji>
            </Paragraph>
            <SocialLinks>
                <Icon.Social
                    icon={faWeibo}
                    bgColor='#f06767'
                    href='http://www.weibo.com'
                />
                <Icon.Social
                    icon={faGithub}
                    bgColor='#000'
                />
                <Icon.Social
                    icon={faLinkedin}
                    bgColor='#2483c0'
                />
            </SocialLinks>
            <Seperator
                css={`
                    margin: 30px 0;
                `}
            />
            <ContactSection>
                <Description label='联系电话'>+86 18612345667</Description>
                <Description label='电子邮件'>admin@gmail.com</Description>
                <Description label='个人网站'>https://www.baidu.com</Description>
            </ContactSection>
            <Seperator
                css={`
                    margin: 30px 0;
                `}
            />
            <AlbumSection>
                <AlbumTitle>
                    <Text type='secondary'>相册（31）</Text>
                    <a href='http://www.baidu.com'>查看全部</a>
                </AlbumTitle>
                <Album>
                    <Photo src={paper1} alt='' />
                    <Photo src={paper2} alt='' />
                    <Photo src={paper3} alt='' />
                </Album>
            </AlbumSection>
        </StyledProfile>
    )
}


function Description ({ label, children }) {
    return (
        <Paragraph>
            <Text type='secondary'>{label}: </Text>
            <Text>{children}</Text>
        </Paragraph>
    )
}

Profile.propTypes = {
    children: PropTypes.any
}

export default Profile


