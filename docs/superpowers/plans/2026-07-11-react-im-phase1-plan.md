# React-IM 一期增强 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 React-IM 8 个缺陷 + 新增 Toast 通知系统、多行输入框，实现完整 IM 体验闭环

**Architecture:** 在现有 SocketProvider → MessageProvider → 组件树的架构上，新增 5 个轻量 hook（useSettings/useDrafts/useBlockedList/useProfile/useToast）实现独立的状态管理，ToastProvider 包裹组件树提供全局通知

**Tech Stack:** React 18, styled-components 6, react-spring 9, socket.io-client 4, Vite 5, Vitest

---

## 文件结构概览

```
新建:
  src/hooks/useSettings.js          — 设置项 localStorage 持久化
  src/hooks/useDrafts.js            — 草稿缓存 (内存 Map)
  src/hooks/useBlockedList.js       — 屏蔽列表 localStorage 管理
  src/hooks/useProfile.js           — 个人资料 localStorage 持久化
  src/hooks/useToast.js             — Toast 状态管理
  src/components/Toast/index.jsx    — Toast 通知组件
  src/components/Toast/style.js     — Toast 样式

修改:
  src/App.jsx                        — 包裹 ToastProvider
  src/context/MessageContext.jsx     — 未读计数 + 屏蔽过滤
  src/components/Footer/index.jsx    — 草稿恢复 + 多行输入
  src/components/Input/index.jsx     — textarea 多行支持
  src/components/Conversation/index.jsx — 关闭会话回调
  src/components/TitleBar/index.jsx  — 菜单项功能实现
  src/components/Settings/index.jsx  — 绑定 useSettings
  src/components/ConcatCard/index.jsx — 增加 onClick
  src/components/ConcatList/index.jsx — 点击发起聊天
  src/components/MessageList/index.jsx — 搜索过滤 + 未读计数
  src/components/FilterList/index.jsx  — 暴露 onSearch
  src/components/EditProfile/index.jsx — 绑定 useProfile
  src/components/Profile/index.jsx     — 读取 useProfile
  src/components/Dropdown/index.jsx    — 点击选项后关闭
```

---

### Task 1: useSettings Hook

**Files:**
- Create: `src/hooks/useSettings.js`

- [ ] **Step 1: 创建 hook 文件**

```javascript
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'react-im-settings'

const defaultSettings = {
  newMessageNotification: true,
  voiceVideoAlert: true,
  showNotificationDetail: true,
  sound: true,
  friendVerification: true,
  recommendContacts: true,
  findByPhone: false,
}

function loadSettings () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...defaultSettings }
}

export default function useSettings () {
  const [settings, setSettings] = useState(loadSettings)

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { settings, updateSetting }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/hooks/useSettings.js
git commit -m "feat: add useSettings hook with localStorage persistence"
```

---

### Task 2: useDrafts Hook

**Files:**
- Create: `src/hooks/useDrafts.js`

- [ ] **Step 1: 创建 hook 文件**

```javascript
import { useState, useCallback, useRef } from 'react'

export default function useDrafts () {
  const draftsRef = useRef(new Map())
  const [, forceUpdate] = useState(0)

  const saveDraft = useCallback((contactId, text) => {
    draftsRef.current.set(contactId, text)
  }, [])

  const getDraft = useCallback((contactId) => {
    return draftsRef.current.get(contactId) || ''
  }, [])

  const clearDraft = useCallback((contactId) => {
    draftsRef.current.delete(contactId)
    forceUpdate(n => n + 1)
  }, [])

  return { saveDraft, getDraft, clearDraft }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/hooks/useDrafts.js
git commit -m "feat: add useDrafts hook with in-memory draft cache"
```

---

### Task 3: useBlockedList Hook

**Files:**
- Create: `src/hooks/useBlockedList.js`

- [ ] **Step 1: 创建 hook 文件**

```javascript
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'react-im-blocked'

function loadBlocked () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function useBlockedList () {
  const [blockedIds, setBlockedIds] = useState(loadBlocked)

  const blockContact = useCallback((contactId) => {
    setBlockedIds(prev => {
      if (prev.includes(contactId)) return prev
      const next = [...prev, contactId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const unblockContact = useCallback((contactId) => {
    setBlockedIds(prev => {
      const next = prev.filter(id => id !== contactId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isBlocked = useCallback((contactId) => blockedIds.includes(contactId), [blockedIds])

  return { blockedIds, blockContact, unblockContact, isBlocked }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/hooks/useBlockedList.js
git commit -m "feat: add useBlockedList hook with localStorage persistence"
```

---

### Task 4: useProfile Hook

**Files:**
- Create: `src/hooks/useProfile.js`

- [ ] **Step 1: 创建 hook 文件**

```javascript
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'react-im-profile'

const defaultProfile = {
  name: '',
  gender: '男',
  region: '北京市 海淀区',
  signature: '前端小白，努力让自己在前端的路上走更远一些 ✊ 💪 💯',
  phone: '+86 18612345667',
  email: 'admin@gmail.com',
  website: 'https://www.baidu.com',
  weibo: '',
  github: '',
  linkedin: '',
}

function loadProfile () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultProfile, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...defaultProfile }
}

export default function useProfile () {
  const [profile, setProfile] = useState(loadProfile)

  const updateProfile = useCallback((fields) => {
    setProfile(prev => {
      const next = { ...prev, ...fields }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { profile, updateProfile }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/hooks/useProfile.js
git commit -m "feat: add useProfile hook with localStorage persistence"
```

---

### Task 5: useToast Hook + Toast 组件

**Files:**
- Create: `src/hooks/useToast.js`
- Create: `src/components/Toast/index.jsx`
- Create: `src/components/Toast/style.js`

- [ ] **Step 1: 创建 useToast hook**

`src/hooks/useToast.js`:
```javascript
import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider ({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      )}
    </ToastContext.Provider>
  )
}

export function useToast () {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ToastContainer 内联定义（轻量组件，无需独立文件）
const typeColors = {
  info: '#4f9dde',
  success: '#34d859',
  warning: '#f0ad4e',
  error: '#f34848',
}

function ToastContainer ({ toasts, onRemove }) {
  return React.createElement('div', {
    style: {
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
    }
  },
    toasts.map(t => React.createElement('div', {
      key: t.id,
      onClick: () => onRemove(t.id),
      style: {
        background: typeColors[t.type] || typeColors.info,
        color: '#fff', padding: '10px 20px', borderRadius: 8,
        fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,.2)',
        animation: 'slideIn 0.3s ease',
        maxWidth: 320, wordBreak: 'break-word',
      }
    }, t.message))
  )
}
```

- [ ] **Step 2: 创建 Toast 样式**

`src/components/Toast/style.js`:
```javascript
import { createGlobalStyle } from 'styled-components'

const ToastGlobalStyle = createGlobalStyle`
  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`

export default ToastGlobalStyle
```

- [ ] **Step 3: 创建 Toast 组件入口**

`src/components/Toast/index.jsx`:
```javascript
import ToastGlobalStyle from './style'

// ToastGlobalStyle 注入全局动画 keyframe
export { ToastProvider, useToast } from 'hooks/useToast'
export { default as ToastStyle } from './style'
```

- [ ] **Step 4: 提交**

```bash
git add src/hooks/useToast.js src/components/Toast/
git commit -m "feat: add Toast notification system with useToast hook"
```

---

### Task 6: App 包裹 ToastProvider

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: 在 App 中包裹 ToastProvider**

找到 `src/App.jsx` — 将 import 和 JSX 更新为：

```javascript
import React from 'react'
import './index.css'
import './App.css'
import { ThemeProvider } from 'styled-components'
import theme from './theme'
import ChatApp from 'components/ChatApp'
import { HashRouter as Router } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { MessageProvider } from './context/MessageContext'
import { ToastProvider } from 'components/Toast'

function App () {
  return (
    <Router>
      <ToastProvider>
        <SocketProvider>
          <MessageProvider>
            <ThemeProvider theme={theme}>
              <ChatApp />
            </ThemeProvider>
          </MessageProvider>
        </SocketProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
```

- [ ] **Step 2: 提交**

```bash
git add src/App.jsx
git commit -m "feat: wrap App with ToastProvider"
```

---

### Task 7: Settings 绑定 useSettings

**Files:**
- Modify: `src/components/Settings/index.jsx`

- [ ] **Step 1: 更新 Settings 组件**

重写 `src/components/Settings/index.jsx`：

```javascript
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
```

- [ ] **Step 2: 更新 Switch 组件以支持受控模式**

`src/components/Switch/index.jsx` 需支持 `checked` + `onChange` props：

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import StyledSwitch, { Checkbox, Slider } from './style'

function Switch ({ checked, onChange, ...rest }) {
    return (
        <StyledSwitch {...rest}>
            <Checkbox
                type='checkbox'
                checked={checked}
                onChange={(e) => onChange && onChange(e.target.checked)}
            />
            <Slider />
        </StyledSwitch>
    )
}

Switch.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
}

export default Switch
```

- [ ] **Step 3: 提交**

```bash
git add src/components/Settings/index.jsx src/components/Switch/index.jsx
git commit -m "feat: bind Settings to useSettings hook, make Switch controlled"
```

---

### Task 8: TitleBar 菜单功能（关闭会话 + 屏蔽此人）

**Files:**
- Modify: `src/components/TitleBar/index.jsx`

- [ ] **Step 1: 更新 TitleBar**

重写 `src/components/TitleBar/index.jsx`：

```javascript
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
```

- [ ] **Step 2: 更新 Dropdown — 点击选项后自动关闭**

`src/components/Dropdown/index.jsx` — DropdownItem 的 onClick 触发后关闭下拉：

```javascript
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledDropdown, { DropdownContainer } from './style'

function Dropdown ({ content, align = 'right', children, ...rest }) {
    const [visible, setVisible] = useState(false)

    const handleToggle = () => setVisible(!visible)

    const handleClose = () => setVisible(false)

    return (
        <StyledDropdown onClick={handleToggle} {...rest}>
            {content && (
                <DropdownContainer align={align} visible={visible} onClick={handleClose}>
                    {content}
                </DropdownContainer>
            )}
            {children}
        </StyledDropdown>
    )
}

Dropdown.propTypes = {
    children: PropTypes.any,
    content: PropTypes.any,
    align: PropTypes.oneOf(['top', 'left', 'bottom', 'right'])
}

export default Dropdown
```

- [ ] **Step 3: 提交**

```bash
git add src/components/TitleBar/index.jsx src/components/Dropdown/index.jsx
git commit -m "feat: implement close conversation and block contact in TitleBar menu"
```

---

### Task 9: Conversation 传递 onCloseConversation

**Files:**
- Modify: `src/components/Conversation/index.jsx`
- Modify: `src/context/MessageContext.jsx`（增加 closeConversation）

- [ ] **Step 1: MessageContext 增加 closeConversation**

在 `src/context/MessageContext.jsx` 的 `MessageProvider` 中，在 `openConversation` 下方添加：

```javascript
const closeConversation = useCallback(() => {
    setActiveContactId(null)
}, [])

// 同时在 Provider value 中增加:
// closeConversation,
```

Provider value 变为：
```javascript
<MessageContext.Provider value={{
    contacts,
    messages,
    activeContactId,
    connected,
    userId,
    sendTextMessage,
    sendVoiceMessage,
    openConversation,
    closeConversation,
    loadHistory,
}}>
```

- [ ] **Step 2: Conversation 传递 onCloseConversation**

`src/components/Conversation/index.jsx` — 在 TitleBar 上增加 `onCloseConversation` prop：

```javascript
const { messages, activeContactId, userId, closeConversation } = useMessages()
// ... 

<TitleBar
    onAvatarClick={onAvatarClick}
    onVideoClick={onVideoClick}
    onCloseConversation={closeConversation}
    titleBarAnimation={titleBarAnimation}
/>
```

- [ ] **Step 3: 提交**

```bash
git add src/context/MessageContext.jsx src/components/Conversation/index.jsx
git commit -m "feat: add closeConversation to MessageContext, wire through Conversation"
```

---

### Task 10: FilterList 暴露搜索框事件

**Files:**
- Modify: `src/components/FilterList/index.jsx`

- [ ] **Step 1: FilterList 增加 onSearch prop**

重写 `src/components/FilterList/index.jsx`：

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import StyledFilterList from './style'
import Input from 'components/Input'
import Filter from 'components/Filter'
import Select from 'components/Select'
import Option from 'components/Option'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Plus from 'assets/icons/plus.svg?react'

function FilterList ({
    children,
    options,
    filterLabel = '列表排序',
    actionLabel,
    onSearch,
    ...rest
}) {
    return (
        <StyledFilterList {...rest}>
            <Input.Search onChange={(e) => onSearch && onSearch(e.target.value)} />
            <Filter style={{ padding: '20px 0' }}>
                {options && (
                    <Filter.Filters label='列表排序'>
                        <Select>
                            {options.map((option, index) => (
                                <Option key={index}>{option}</Option>
                            ))}
                        </Select>
                    </Filter.Filters>
                )}
                {actionLabel && (
                    <Filter.Action label='创建会话'>
                        <Button>
                            <Icon icon={Plus} width={12} height={12} />
                        </Button>
                    </Filter.Action>
                )}
            </Filter>
            {children}
        </StyledFilterList>
    )
}

FilterList.propTypes = {
    children: PropTypes.any,
    options: PropTypes.array,
    filterLabel: PropTypes.string,
    actionLabel: PropTypes.string,
    onSearch: PropTypes.func,
}

export default FilterList
```

- [ ] **Step 3: 提交**

```bash
git add src/components/FilterList/index.jsx
git commit -m "feat: add onSearch prop to FilterList"
```

---

### Task 11: ConcatList 点击联系人发起聊天

**Files:**
- Modify: `src/components/ConcatCard/index.jsx`
- Modify: `src/components/ConcatList/index.jsx`

- [ ] **Step 1: ConcatCard 增加 onClick prop**

在 `src/components/ConcatCard/index.jsx` 的 `StyledConcatCard` 上增加 `onClick`：

```javascript
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
```

- [ ] **Step 2: ConcatList 传入 openConversation**

`src/components/ConcatList/index.jsx`：

```javascript
function ConcatList ({ children, ...rest }) {
    const { contacts, openConversation } = useMessages()
    const trailAnimation = useStaggeredList(contacts.length || 1)

    return (
        <StyledConcatList {...rest}>
            <FilterList
                options={['新添加优先', '按姓名排序']}
                actionLabel='添加好友'
            >
                <Contacts>
                    {contacts.map((contact, index) => (
                        <animated.div key={contact.id} style={trailAnimation[index]}>
                            <ConcatCard
                                key={contact.id}
                                avatar={contact.avatar}
                                name={contact.name}
                                intro={contact.intro}
                                status={contact.online ? 'online' : 'offline'}
                                onClick={() => openConversation(contact.id)}
                            />
                        </animated.div>
                    ))}
                </Contacts>
            </FilterList>
            {children}
        </StyledConcatList>
    )
}
```

- [ ] **Step 3: 更新 ConcatCard 样式支持点击态**

`src/components/ConcatCard/style.js` — 在 `StyledConcatCard` 中加 `cursor: pointer`：

```javascript
const StyledConcatCard = styled.div`
    display: grid;
    /* ...existing styles... */
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background: ${({ theme }) => theme.gray2};
        border-radius: 8px;
    }
`
```

- [ ] **Step 4: 提交**

```bash
git add src/components/ConcatCard/ src/components/ConcatList/
git commit -m "feat: ConcatCard click opens conversation"
```

---

### Task 12: MessageList 搜索过滤 + 未读计数

**Files:**
- Modify: `src/components/MessageList/index.jsx`
- Modify: `src/context/MessageContext.jsx`（增加 unreadCounts 状态）

- [ ] **Step 1: MessageContext 增加未读计数**

在 `src/context/MessageContext.jsx` 中：

```javascript
const [unreadCounts, setUnreadCounts] = useState({})

// message:new 监听器中增加：
const cleanup = on('message:new', (msg) => {
    const otherId = msg.from
    setMessages(prev => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), msg],
    }))
    // 如果发消息的人不是当前正在聊天的联系人，则增加未读计数
    setUnreadCounts(prev => {
        if (otherId === activeContactId) return prev
        return { ...prev, [otherId]: (prev[otherId] || 0) + 1 }
    })
})

// openConversation 中清零未读计数：
const openConversation = useCallback((contactId) => {
    setActiveContactId(contactId)
    loadHistory(contactId)
    setUnreadCounts(prev => {
        if (!prev[contactId]) return prev
        const next = { ...prev }
        delete next[contactId]
        return next
    })
}, [loadHistory])

// Provider value 增加 unreadCounts
```

- [ ] **Step 2: MessageList 搜索过滤 + 未读计数显示**

重写 `src/components/MessageList/index.jsx`：

```javascript
import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import StyledMessageList, { ChatList } from './style'
import MessageCard from 'components/MessageCard'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'
import FilterList from 'components/FilterList'
import { animated } from 'react-spring'
import useStaggeredList from 'hooks/useStaggeredList'
import { useMessages } from 'context/MessageContext'

function getAvatarSrc(avatar) {
    return avatar === 'avatar-2' ? avatarImg2 : avatarImg1
}

function MessageList ({ children, ...rest }) {
    const { contacts, activeContactId, openConversation, messages, unreadCounts } = useMessages()
    const [searchText, setSearchText] = useState('')

    const filteredContacts = useMemo(() => {
        if (!searchText.trim()) return contacts
        const keyword = searchText.trim().toLowerCase()
        return contacts.filter(contact => {
            if (contact.name.toLowerCase().includes(keyword)) return true
            const contactMsgs = messages[contact.id] || []
            return contactMsgs.some(m =>
                m.type === 'text' && m.content.toLowerCase().includes(keyword)
            )
        })
    }, [contacts, messages, searchText])

    const trailAnimation = useStaggeredList(filteredContacts.length || 1)

    return (
        <StyledMessageList {...rest}>
            <FilterList
                options={['最新消息优先', '在线好友优先']}
                actionLabel='创建会话'
                onSearch={setSearchText}
            >
                <ChatList>
                    {filteredContacts.map((contact, index) => {
                        const contactMsgs = messages[contact.id] || []
                        const lastMsg = contactMsgs[contactMsgs.length - 1]
                        return (
                            <animated.div key={contact.id} style={trailAnimation[index]}>
                                <MessageCard
                                    key={contact.id}
                                    active={contact.id === activeContactId}
                                    replied={false}
                                    avatarSrc={getAvatarSrc(contact.avatar)}
                                    name={contact.name}
                                    avatarStatus={contact.online ? 'online' : 'offline'}
                                    statusText={contact.online ? '在线' : '离线'}
                                    time={lastMsg?.time || ''}
                                    message={lastMsg?.content || contact.lastMessage || ''}
                                    unreadCount={unreadCounts[contact.id] || 0}
                                    onClick={() => openConversation(contact.id)}
                                />
                            </animated.div>
                        )
                    })}
                </ChatList>
            </FilterList>
        </StyledMessageList>
    )
}

MessageList.propTypes = {
    children: PropTypes.any
}
export default MessageList
```

- [ ] **Step 3: 提交**

```bash
git add src/context/MessageContext.jsx src/components/MessageList/index.jsx
git commit -m "feat: add unread counts and search filtering to MessageList"
```

---

### Task 13: 草稿保存 + 多行输入

**Files:**
- Modify: `src/components/Footer/index.jsx`
- Modify: `src/components/Input/index.jsx`

- [ ] **Step 1: Input 增加 textarea 多行支持**

在 `src/components/Input/index.jsx` 中增加 multiline 分支：

```javascript
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import StyledInput, { InputContainer, Prefix, Suffix, StyledTextArea } from './style'
// ... 其他 imports 不变

const Input = forwardRef(function Input ({
    placeholder = '请输入内容',
    prefix,
    suffix,
    multiline,
    ...rest
}, ref) {
    return (
        <InputContainer>
            {prefix && <Prefix>{prefix}</Prefix>}
            {multiline ? (
                <StyledTextArea ref={ref} placeholder={placeholder} rows={1} {...rest} />
            ) : (
                <StyledInput ref={ref} placeholder={placeholder} {...rest} />
            )}
            {suffix && <Suffix>{suffix}</Suffix>}
        </InputContainer>
    )
})
```

在 `src/components/Input/style.js` 中增加 `StyledTextArea`：

```javascript
export const StyledTextArea = styled.textarea`
    outline: none;
    width: 100%;
    min-height: 48px;
    max-height: 120px;
    border: none;
    background: none;
    color: ${({ theme }) => theme.grayDark};
    font-size: ${({ theme }) => theme.medium};
    display: block;
    resize: none;
    padding: 12px 0;
    font-family: inherit;
    line-height: 1.5;
    &::placeholder {
        color: ${({ theme }) => theme.gray3};
    }
`
```

导出 `StyledTextArea`。

- [ ] **Step 2: Footer 草稿保存 + 多行输入 + Shift+Enter 换行**

更新 `src/components/Footer/index.jsx`：

```javascript
// 增加 import
import useDrafts from 'hooks/useDrafts'

function Footer ({ footerAnimation, style, ...rest }) {
    const { saveDraft, getDraft, clearDraft } = useDrafts()
    const { sendTextMessage, sendVoiceMessage, activeContactId } = useMessages()
    
    // 从草稿恢复
    const [inputValue, setInputValue] = useState(() => getDraft(activeContactId))
    const prevContactRef = useRef(activeContactId)

    // 切换会话时保存旧草稿、恢复新草稿
    if (prevContactRef.current !== activeContactId) {
        saveDraft(prevContactRef.current, inputValue)
        setInputValue(getDraft(activeContactId))
        prevContactRef.current = activeContactId
    }

    const handleSend = () => {
        if (!inputValue.trim()) return
        sendTextMessage(inputValue)
        setInputValue('')
        clearDraft(activeContactId)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value)
        saveDraft(activeContactId, e.target.value)
    }
    
    // ... render 中 Input 改为 multiline:
    return (
        <StyledFooter style={{ ...style, ...footerAnimation }} {...rest}>
            <Input
                multiline
                placeholder='请输入想和对方说的话，Shift+Enter 换行'
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={!activeContactId || recordingState !== 'idle'}
                prefix={recordingState === 'idle' ? <Icon icon={ClipIcon} /> : null}
                suffix={renderSuffix()}
                ref={inputRef}
            />
        </StyledFooter>
    )
}
```

- [ ] **Step 3: 提交**

```bash
git add src/components/Footer/index.jsx src/components/Input/index.jsx src/components/Input/style.js
git commit -m "feat: add multiline textarea input and draft save/restore"
```

---

### Task 14: EditProfile + Profile 绑定 useProfile

**Files:**
- Modify: `src/components/EditProfile/index.jsx`
- Modify: `src/components/Profile/index.jsx`

- [ ] **Step 1: Profile 从 useProfile 读取数据**

`src/components/Profile/index.jsx` — 用 `useProfile()` 替代硬编码：

```javascript
import useProfile from 'hooks/useProfile'

function Profile ({ ... }) {
    const { profile } = useProfile()
    
    return (
        <StyledProfile {...rest}>
            {/* ... */}
            <Paragraph size='xlarge' ...>{name || profile.name || '未设置昵称'}</Paragraph>
            <Paragraph size='medium' type='secondary' ...>{profile.region}</Paragraph>
            <Paragraph ...>{profile.signature}</Paragraph>
            {/* ... */}
            <ContactSection>
                <Description label='联系电话'>{profile.phone}</Description>
                <Description label='电子邮件'>{profile.email}</Description>
                <Description label='个人网站'>{profile.website}</Description>
            </ContactSection>
            {/* ... */}
        </StyledProfile>
    )
}
```

- [ ] **Step 2: EditProfile 表单绑定 useProfile**

`src/components/EditProfile/index.jsx` — 编辑模式下绑定 profile 状态：

```javascript
import useProfile from 'hooks/useProfile'

function EditProfile ({ src, ...rest }) {
    const [showEdit, setShowEdit] = useState(false)
    const { profile, updateProfile } = useProfile()
    const [form, setForm] = useState(profile)

    if (!showEdit) {
        return <Profile onEdit={() => setShowEdit(true)} showEditBtn showCloseIcon={false} src={src} />
    }

    const handleSave = () => {
        updateProfile(form)
        setShowEdit(false)
    }

    return (
        <StyledEditProfile {...rest}>
            {/* Avatar + Confirm button */}
            <Button size='52px' ...>
                <FontAwesomeIcon icon={faCheck} onClick={handleSave} ... />
            </Button>

            <GroupTitle>基本信息</GroupTitle>
            <InputText label='昵称' value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <GenderAndRegion>
                <Radio.Group label='性别'>
                    <Radio name='gender' checked={form.gender === '男'} onChange={() => setForm({...form, gender: '男'})}>男</Radio>
                    <Radio name='gender' checked={form.gender === '女'} onChange={() => setForm({...form, gender: '女'})}>女</Radio>
                </Radio.Group>
                {/* ... region selects ... */}
            </GenderAndRegion>
            <InputText label='个性签名' value={form.signature} onChange={e => setForm({...form, signature: e.target.value})} />

            <GroupTitle>联系信息</GroupTitle>
            <InputText label='联系电话' value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <InputText label='电子邮箱' value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <InputText label='个人网站' value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
        </StyledEditProfile>
    )
}
```

- [ ] **Step 3: 提交**

```bash
git add src/components/EditProfile/index.jsx src/components/Profile/index.jsx
git commit -m "feat: bind EditProfile and Profile to useProfile hook"
```

---

### Task 15: MessageContext 屏蔽过滤 + 在线状态 Toast

**Files:**
- Modify: `src/context/MessageContext.jsx`

- [ ] **Step 1: 在线状态变化发出 Toast + 屏蔽过滤**

在 MessageContext 中整合 useBlockedList 和 useToast：

```javascript
import useBlockedList from 'hooks/useBlockedList'
import { useToast } from 'hooks/useToast'

export function MessageProvider ({ children }) {
    const { socket, connected, emit, on, userId } = useSocket()
    const { isBlocked } = useBlockedList()
    const { showToast } = useToast()
    // ... 现有状态 ...

    // message:new 监听器增加屏蔽过滤
    useEffect(() => {
        const cleanup = on('message:new', (msg) => {
            if (isBlocked(msg.from)) return  // 屏蔽过滤
            
            const otherId = msg.from
            setMessages(prev => ({...}))
            setUnreadCounts(prev => {...})
        })
        return cleanup
    }, [on, isBlocked])

    // user:online / user:offline 增加 Toast
    useEffect(() => {
        const onlineCleanup = on('user:online', ({ userId: uid, name }) => {
            setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: true } : c))
            showToast(`${name || uid} 上线了`, 'info')
        })
        const offlineCleanup = on('user:offline', ({ userId: uid, name }) => {
            setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: false } : c))
            showToast(`${name || uid} 离线了`, 'info')
        })
        return () => { onlineCleanup(); offlineCleanup() }
    }, [on, showToast])

    // 监听 connected 状态变化（网络断开/恢复 Toast）
    // 已在 SocketContext 的 useEffect 中设置 connected 状态

    // ... 其余代码 ...
}
```

- [ ] **Step 2: 更新 contacts 数据传递 name 到 online/offline 事件**

需要服务器端在 `user:online` 和 `user:offline` 事件中包含 name。服务器已经传递了 `{ userId, name, avatar }`，所以 names 已经可用。

客户端也需要存储 contacts 的 name 映射。使用 contacts.find() 查找即可。

更新 online/offline listener：

```javascript
const onlineCleanup = on('user:online', ({ userId: uid, name }) => {
    setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: true } : c))
    showToast(`${name || uid} 上线了`, 'info')
})
const offlineCleanup = on('user:offline', ({ userId: uid }) => {
    setContacts(prev => {
        const contact = prev.find(c => c.id === uid)
        if (contact) showToast(`${contact.name} 离线了`, 'info')
        return prev.map(c => c.id === uid ? { ...c, online: false } : c)
    })
})
```

- [ ] **Step 3: 提交**

```bash
git add src/context/MessageContext.jsx
git commit -m "feat: add blocked user filtering and online/offline toast notifications"
```

---

### Task 16: 集成测试 & 修复

- [ ] **Step 1: 构建验证**

```bash
cd /Users/zephyr/code/React-IM && pnpm build
```

预期：无错误，构建成功。

- [ ] **Step 2: 启动服务端测试**

```bash
pnpm server &
sleep 2
# 用 socket.io test 脚本验证消息收发仍然正常
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "chore: final integration fixes after Phase 1 implementation"
```

---

## 总结

| 任务 | 涉及文件 | 功能 |
|------|-----|------|
| T1 | `hooks/useSettings.js` (新) | 设置项 localStorage 持久化 |
| T2 | `hooks/useDrafts.js` (新) | 草稿缓存 |
| T3 | `hooks/useBlockedList.js` (新) | 屏蔽列表管理 |
| T4 | `hooks/useProfile.js` (新) | 个人资料持久化 |
| T5 | `hooks/useToast.js` + `Toast/` (新) | Toast 通知系统 |
| T6 | `App.jsx` | 包裹 ToastProvider |
| T7 | `Settings/` + `Switch/` | 设置开关生效 |
| T8 | `TitleBar/` + `Dropdown/` | 菜单功能实现 |
| T9 | `Conversation/` + `MessageContext` | 关闭会话通路 |
| T10 | `FilterList/` | 搜索框回调 |
| T11 | `ConcatCard/` + `ConcatList/` | 联系人列表可发起聊天 |
| T12 | `MessageList/` + `MessageContext` | 搜索过滤 + 未读计数 |
| T13 | `Footer/` + `Input/` | 草稿保存 + 多行输入 |
| T14 | `EditProfile/` + `Profile/` | 资料持久化 |
| T15 | `MessageContext` | 屏蔽过滤 + Toast |
| T16 | 构建 + 测试 | 集成验证 |
