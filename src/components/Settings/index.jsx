
import React from 'react'
import PropTypes from 'prop-types'
import StyledSettings, { StyledSettingsItem, SettingsItemControl, StyledSettingsGroup } from './style'
import Paragraph from 'components/Paragraph'
import Switch from 'components/Switch'
import Icon from 'components/Icon'
import Seperator from 'components/Seperator'
import ArrowMenuRight from 'assets/icons/arrowRight.svg?react'
import { Link } from 'react-router-dom'
import 'styled-components/macro'
import { useSpring, animated } from 'react-spring'
function Settings ({ children, ...rest }) {
    const settingAnimation = useSpring({
        transform: 'translate3d(0px, 0px, 0px)',
        opacity: 1,
        from: { transform: 'translate3d(100px, 0px, 0px)', opacity: 0 },
        config: {
            tension: 140,
        },
        delay: 300
    })

    return (
        <StyledSettings {...rest}>
            <animated.div style={settingAnimation}>
                <SettingsGroup groupName='隐私设置'>
                    <SettingsItem label='添加好友时需要验证' />
                    <SettingsItem
                        label='推荐通讯录好友'
                        description='上传的通讯录只用来匹配好友列表，不会用作其他用途'
                    />
                    <SettingsItem label='只能通过手机号找到我' />
                </SettingsGroup>

                <SettingsGroup groupName='通知设置'>
                    <SettingsItem label='新消息通知' />
                    <SettingsItem label='语音和视频通话提醒' />
                    <SettingsItem label='显示通知详情' />
                    <SettingsItem label='声音' />
                    <Link
                        to={`/settings/blocked`}
                        css={`
                            text-decoration: none;
                            color: inherit;
                        `}
                    >
                        <SettingsItem label='查看已静音的好友列表' type='menu' />
                    </Link>
                </SettingsGroup>
            </animated.div>
        </StyledSettings>
    )
}

function SettingsGroup ({ groupName, children, ...rest }) {
    return (
        <StyledSettingsGroup>
            <Paragraph size='large' style={{ paddingBottom: '24px' }}>
                {groupName}
            </Paragraph>
            {children}
        </StyledSettingsGroup>
    )
}

export function SettingsItem ({
    type = 'switch',
    label,
    description,
    children,
    ...rest
}) {
    return (
        <StyledSettingsItem {...rest}>
            <SettingsItemControl>
                <Paragraph size='normal'>{label}</Paragraph>
                {type === 'switch' && <Switch style={{ transform: 'scale(0.8)' }} />}
                {type === 'menu' && <Icon icon={ArrowMenuRight} color={'#cacbd2'} style={{ transform: 'scale(0.8)' }} />}
            </SettingsItemControl>

            {description && (
                <Paragraph type='secondary' style={{ margin: '4px 0' }}>
                    {description}
                </Paragraph>
            )}

            <Seperator style={{ marginTop: '8px', marginBottom: '20px' }} />
        </StyledSettingsItem>
    )
}

Settings.propTypes = {
    children: PropTypes.any,
    type: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string
}

export default Settings


