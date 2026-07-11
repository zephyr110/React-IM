import React from 'react'
import PropTypes from 'prop-types'
import StyledSettings, { StyledSettingsItem, SettingsItemControl, StyledSettingsGroup } from './style'
import Paragraph from 'components/Paragraph'
import Switch from 'components/Switch'
import Icon from 'components/Icon'
import Seperator from 'components/Seperator'
import ArrowMenuRight from 'assets/icons/arrowRight.svg?react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import useSettings from 'hooks/useSettings'

function Settings ({ children, ...rest }) {
    const settingAnimation = useSpring({
        from: { transform: 'translate3d(100px, 0px, 0px)', opacity: 0 },
        to: { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 },
        config: { tension: 140 },
        delay: 300
    })

    const { settings, updateSetting } = useSettings()

    return (
        <StyledSettings {...rest}>
            <animated.div style={settingAnimation}>
                <SettingsGroup groupName='隐私设置'>
                    <SettingsItem
                        label='添加好友时需要验证'
                        checked={settings.friendVerification}
                        onChange={(v) => updateSetting('friendVerification', v)}
                    />
                    <SettingsItem
                        label='推荐通讯录好友'
                        description='上传的通讯录只用来匹配好友列表，不会用作其他用途'
                        checked={settings.recommendContacts}
                        onChange={(v) => updateSetting('recommendContacts', v)}
                    />
                    <SettingsItem
                        label='只能通过手机号找到我'
                        checked={settings.findByPhone}
                        onChange={(v) => updateSetting('findByPhone', v)}
                    />
                </SettingsGroup>

                <SettingsGroup groupName='通知设置'>
                    <SettingsItem
                        label='新消息通知'
                        checked={settings.newMessageNotification}
                        onChange={(v) => updateSetting('newMessageNotification', v)}
                    />
                    <SettingsItem
                        label='语音和视频通话提醒'
                        checked={settings.voiceVideoAlert}
                        onChange={(v) => updateSetting('voiceVideoAlert', v)}
                    />
                    <SettingsItem
                        label='显示通知详情'
                        checked={settings.showNotificationDetail}
                        onChange={(v) => updateSetting('showNotificationDetail', v)}
                    />
                    <SettingsItem
                        label='声音'
                        checked={settings.sound}
                        onChange={(v) => updateSetting('sound', v)}
                    />
                    <Link
                        to={`/settings/blocked`}
                        css={`text-decoration: none; color: inherit;`}
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
    checked,
    onChange,
    children,
    ...rest
}) {
    return (
        <StyledSettingsItem {...rest}>
            <SettingsItemControl>
                <Paragraph size='normal'>{label}</Paragraph>
                {type === 'switch' && <Switch checked={checked} onChange={onChange} style={{ transform: 'scale(0.8)' }} />}
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
