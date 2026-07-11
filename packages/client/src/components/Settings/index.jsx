import React from 'react'
import PropTypes from 'prop-types'
import { ChevronRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import useSettings from 'hooks/useSettings'

function ToggleSwitch ({ checked = false, onChange }) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange && onChange(e.target.checked)}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
        </label>
    )
}

function Settings ({ children, ...rest }) {
    const settingAnimation = useSpring({
        from: { transform: 'translate3d(100px, 0px, 0px)', opacity: 0 },
        to: { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 },
        config: { tension: 140 },
        delay: 300
    })

    const { settings, updateSetting } = useSettings()

    return (
        <div className="p-[72px]" {...rest}>
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
                        to="/settings/blocked"
                        className="no-underline text-inherit"
                    >
                        <SettingsItem label='查看已静音的好友列表' type='menu' />
                    </Link>
                </SettingsGroup>
            </animated.div>
        </div>
    )
}

function SettingsGroup ({ groupName, children, ...rest }) {
    return (
        <div className="mb-8" {...rest}>
            <p className="text-lg font-medium pb-6">
                {groupName}
            </p>
            {children}
        </div>
    )
}

function SettingsItem ({
    type = 'switch',
    label,
    description,
    checked,
    onChange,
    children,
    ...rest
}) {
    return (
        <div {...rest}>
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{label}</p>
                {type === 'switch' && (
                    <ToggleSwitch checked={checked} onChange={onChange} />
                )}
                {type === 'menu' && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
            </div>

            {description && (
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
            )}

            <Separator className="mt-2 mb-5" />
        </div>
    )
}

Settings.propTypes = {
    children: PropTypes.any,
    type: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string
}

export default Settings
