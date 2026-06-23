# React-IM 全面升级与通信功能补全 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 React-IM 从 React 16/CRA 3 升级到 React 18/Vite，补全基于 Socket.IO 的实时通信功能

**Architecture:** 分 5 步渐进式升级，每步独立可验证。先迁移构建工具(Vite)，再升级核心框架(React 18 + Router v6)，接着升级样式和动画库，然后升级组件文档(Storybook v8)，最后搭建 Express+Socket.IO 后端并补全前端通信逻辑

**Tech Stack:** Vite, React 18, react-router-dom v6, styled-components v6, react-spring v9, Storybook v8, Express, Socket.IO

---

## 文件结构规划

### 新建文件
- `index.html` — Vite 入口 HTML（根目录）
- `vite.config.js` — Vite 配置
- `server/index.js` — Express 服务入口
- `server/socket.js` — Socket.IO 事件处理
- `server/data/messages.json` — 消息持久化
- `server/data/contacts.json` — 联系人数据
- `src/context/SocketContext.jsx` — Socket 连接管理层
- `src/context/MessageContext.jsx` — 消息状态管理
- `src/components/Login/index.jsx` — 登录页组件
- `src/components/Login/style.js` — 登录页样式

### 修改文件
- `package.json` — 依赖全部更新
- `src/index.js` → `src/index.jsx` — React 18 createRoot
- `src/App.js` → `src/App.jsx` — Router v6 适配
- `src/components/ChatApp/index.js` → `index.jsx` — Routes/useTransition 重写
- `src/components/Conversation/index.js` → `index.jsx` — 真实数据+useSpring 重写
- `src/hooks/useStaggeredList.js` → `.jsx` — useTrail v9 API
- `.storybook/main.js` → `main.ts` — v8 配置
- `.storybook/preview.js` — decorators 导出
- 所有 `.js` → `.jsx`（含 JSX 的文件）
- 16 个 `.stories.js` → CSF v3 格式
- `src/components/Footer/index.jsx` — 输入提交逻辑
- `src/components/MessageList/index.jsx` — 真实联系人数据
- `src/components/ConcatList/index.jsx` — 真实联系人列表
- `src/components/TitleBar/index.jsx` — 在线状态显示

---

### Task 1: 准备工作——创建隔离工作区并初始化分支

**Files:**
- 无需修改文件

- [ ] **Step 1: 创建 git worktree 隔离工作区**

使用 EnterWorktree 工具创建隔离的 git worktree。

- [ ] **Step 2: 确认工作区状态**

```bash
cd /path/to/worktree && git branch && ls
```

Expected: 在新的 worktree 目录下，文件完整，在新分支上

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: 初始化升级分支"
```

---

### Task 2: CRA → Vite 迁移

**Files:**
- Create: `index.html`、`vite.config.js`
- Modify: `package.json`
- Delete: `public/index.html`（CRA 的）
- Rename: `src/` 下所有含 JSX 的 `.js` → `.jsx`

- [ ] **Step 1: 安装 Vite 依赖**

```bash
yarn add -D vite @vitejs/plugin-react
```

- [ ] **Step 2: 创建根目录 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="React IM - 即时通讯应用" />
    <title>React IM</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: 创建 vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

- [ ] **Step 4: 重命名所有含 JSX 的 .js 文件为 .jsx**

```bash
# 将 src 下所有 .js 文件重命名为 .jsx（排除非 JSX 文件）
find src -name "*.js" | while read f; do
  if grep -q "import React\|JSX\|<[A-Z]\|<[a-z]" "$f" 2>/dev/null; then
    mv "$f" "${f%.js}.jsx"
  fi
done
```

- [ ] **Step 5: 更新 package.json scripts**

```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

同时移除 `react-scripts` 依赖：
```bash
yarn remove react-scripts
```

- [ ] **Step 6: 验证 Vite dev server 启动**

```bash
yarn start
```

Expected: 开发服务器启动成功（可能有一些警告，但页面应加载）

- [ ] **Step 7: 验证 Vite build**

```bash
yarn build
```

Expected: 构建成功，输出到 `dist/` 目录

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "build: CRA → Vite 迁移

- 安装 vite + @vitejs/plugin-react
- 创建 vite.config.js 配置路径别名
- index.html 移到根目录作为 Vite 入口
- 所有 JSX 文件 .js → .jsx
- 更新 package.json scripts
- 移除 react-scripts

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: React 18 + React Router v6 升级

**Files:**
- Modify: `src/index.jsx`、`src/App.jsx`、`src/components/ChatApp/index.jsx`
- 全局: `<Switch>` → `<Routes>` 模式

- [ ] **Step 1: 安装升级后的依赖**

```bash
yarn add react@18 react-dom@18 react-router-dom@6 prop-types
yarn add -D @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest
```

- [ ] **Step 2: 更新 src/index.jsx — React 18 createRoot**

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 3: 更新 src/App.jsx — Router v6 保持兼容**

```jsx
import React from 'react'
import './index.css'
import './App.css'
import { ThemeProvider } from 'styled-components'
import theme from './theme'
import ChatApp from 'components/ChatApp'
import { HashRouter as Router } from 'react-router-dom'

function App () {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <ChatApp />
      </ThemeProvider>
    </Router>
  )
}

export default App
```

- [ ] **Step 4: 更新 ChatApp/index.jsx — Switch → Routes**

```jsx
import React, { useState } from 'react'
import StyledChatApp, { Nav, Sidebar, Content, Drawer } from './style'
import NavBar from 'components/NavBar'
import MessageList from 'components/MessageList'
import Conversation from 'components/Conversation'
import Profile from 'components/Profile'
import { Routes, Route, useLocation } from 'react-router-dom'
import ConcatList from 'components/ConcatList'
import FileList from 'components/FileList'
import NoteList from 'components/NoteList'
import EditProfile from 'components/EditProfile'
import Settings from 'components/Settings'
import BlockedList from 'components/BlockedList'
import VideoCall from 'components/VideoCall'
import { useTransition, animated } from 'react-spring'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'

function ChatApp ({ children, ...rest }) {
    const [showDrawer, setShowDrawer] = useState(false)
    const [videoCalling, setVideoCalling] = useState(false)

    const location = useLocation()
    const getFirstSgmPath = (location) => location.pathname.split('/')[1]
    const transitions = useTransition(location, getFirstSgmPath, {
        from: { opacity: 0, transform: 'translate3d(-100px, 0, 0)' },
        enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        leave: { opacity: 0, transform: 'translate3d(-100px, 0, 1)' }
    })

    return (
        <StyledChatApp {...rest}>
            <Nav>
                <NavBar />
            </Nav>
            <Sidebar>
                {transitions.map(({ item: location, props, key }) => (
                    <animated.div key={key} style={props}>
                        <Routes location={location}>
                            <Route path="/" element={<MessageList />} />
                            <Route path="/contacts" element={<ConcatList />} />
                            <Route path="/files" element={<FileList />} />
                            <Route path="/notes" element={<NoteList />} />
                            <Route path="/settings" element={<EditProfile src={avatarImg1} />} />
                        </Routes>
                    </animated.div>
                ))}
            </Sidebar>
            <Content>
                {videoCalling && <VideoCall onHangOffClick={() => setVideoCalling(false)} />}
                <Routes>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/blocked" element={<BlockedList />} />
                    <Route path="/*" element={
                        <Conversation
                            onAvatarClick={() => setShowDrawer(true)}
                            onVideoClick={() => setVideoCalling(true)}
                        />
                    } />
                </Routes>
            </Content>
            <Drawer show={showDrawer}>
                <Profile src={avatarImg2} name={'林凌'} onCloseClick={() => setShowDrawer(false)} />
            </Drawer>
        </StyledChatApp>
    )
}

export default ChatApp
```

- [ ] **Step 5: 修复 VedioCall 拼写 → VideoCall（文件名+导入）**

```bash
# 重命名组件目录
mv src/components/VedioCall src/components/VideoCall
# 更新其中所有 .js → .jsx（Vite 需要）
```

- [ ] **Step 6: 验证构建**

```bash
yarn build
```

Expected: 构建成功，Vite 可能报警告但不应有错误

- [ ] **Step 7: 验证开发服务器**

```bash
yarn start
```

Expected: 页面正常加载，路由切换正常

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: React 18 + React Router v6 升级

- ReactDOM.render → createRoot
- Switch → Routes, component → element
- 安装 prop-types 独立包
- VedioCall → VideoCall 修正拼写
- 升级 testing-library 到最新

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: styled-components v6 + react-spring v9 升级

**Files:**
- Modify: `src/hooks/useStaggeredList.jsx`
- Modify: `src/components/ChatApp/index.jsx`
- Modify: `src/components/Conversation/index.jsx`
- 全局: 修复 `translated3d` → `translate3d` 拼写错误

- [ ] **Step 1: 安装升级后的依赖**

```bash
yarn add styled-components@6 react-spring@9
```

- [ ] **Step 2: 重写 useStaggeredList.jsx — useTrail v9 API**

```jsx
import { useTrail } from 'react-spring'

export default function useStaggeredList (number) {
    const trailAnimation = useTrail(number, {
        from: { transform: 'translate3d(-50px, 0px, 0px)' },
        to: { transform: 'translate3d(0px, 0px, 0px)' },
        config: {
            mass: 0.8,
            tension: 280,
            friction: 20
        },
        delay: 200
    })
    return trailAnimation
}
```

- [ ] **Step 3: 重写 Conversation/index.jsx — useSpring v9 API**

```jsx
import React from 'react'
import StyledConversation, { Conversations, MyChatBubble } from './style'
import TitleBar from 'components/TitleBar'
import ChatBubble from 'components/ChatBubble'
import VoiceMessage from 'components/VoiceMessage'
import Emoji from 'components/Emoji'
import Footer from 'components/Footer'
import { useSpring, animated } from 'react-spring'

function Conversation ({ onAvatarClick, onVideoClick, children, ...rest }) {
    const titleBarAnimation = useSpring({
        from: { opacity: 0, transform: 'translate3d(0px, -50px, 0px)' },
        to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
        delay: 300,
    })

    const coversationAnimation = useSpring({
        from: { opacity: 0, transform: 'translate3d(50px, 0px, 0px)' },
        to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
        delay: 450,
    })

    const footerAnimation = useSpring({
        from: { opacity: 0, transform: 'translate3d(0px, 50px, 0px)' },
        to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
        delay: 600,
    })

    return (
        <StyledConversation {...rest}>
            <TitleBar
                onAvatarClick={onAvatarClick}
                onVideoClick={onVideoClick}
                titleBarAnimation={titleBarAnimation}
            />
            <Conversations as={animated.div} style={coversationAnimation}>
                <ChatBubble time="昨天 下午14:26"> Hi～ 小天，忙什么呢？ </ChatBubble>
                <MyChatBubble time="昨天 下午14:28"> 忙着写Bug呢 </MyChatBubble>
                <ChatBubble time="昨天 下午14:38">
                    <VoiceMessage time="01:15" />
                </ChatBubble>
                <MyChatBubble time="昨天 下午14:42">
                    本来是一个，改着改着多了4个，脑壳疼～
                    <Emoji label="smile"> 😂😂😂 </Emoji>
                </MyChatBubble>
            </Conversations>
            <Footer footerAnimation={footerAnimation} />
        </StyledConversation>
    )
}

export default Conversation
```

- [ ] **Step 4: 重写 ChatApp/index.jsx — useTransition v9 API**

在 Task 3 的基础上更新 useTransition 部分：

```jsx
// useTransition v9 — 改为 render props 模式
const transitions = useTransition(location, {
    from: { opacity: 0, transform: 'translate3d(-100px, 0, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    leave: { opacity: 0, transform: 'translate3d(-100px, 0, 1)' },
    keys: getFirstSgmPath,
})

// 渲染部分改为：
<Sidebar>
    {transitions((style, item) => (
        <animated.div style={style}>
            <Routes location={item}>
                <Route path="/" element={<MessageList />} />
                <Route path="/contacts" element={<ConcatList />} />
                <Route path="/files" element={<FileList />} />
                <Route path="/notes" element={<NoteList />} />
                <Route path="/settings" element={<EditProfile src={avatarImg1} />} />
            </Routes>
        </animated.div>
    ))}
</Sidebar>
```

- [ ] **Step 5: 全局修复拼写错误**

```bash
# 搜索并修复 translated3d → translate3d
grep -r "translated3d\|translated3s" src/ --include="*.jsx" --include="*.js" -l | while read f; do
  sed -i '' 's/translated3d/translate3d/g; s/translated3s/translate3d/g' "$f"
done
```

- [ ] **Step 6: 验证构建和运行**

```bash
yarn build && yarn start
```

Expected: 构建成功，动画正常播放

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: styled-components v6 + react-spring v9 升级

- useSpring v9 API: { from, to } 新签名
- useTrail v9 API: { from, to } 新签名
- useTransition v9 API: render props 模式
- 全局修复 translated3d 拼写错误
- Conversation 中 Conversations 组件使用 as={animated.div}

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Storybook v5 → v8 升级

**Files:**
- Modify: `.storybook/main.js` → `.storybook/main.ts`
- Modify: `.storybook/preview.js`
- Modify: 所有 `src/**/*.stories.js` → CSF v3 格式
- Delete: `.storybook/config.js`（如果有）

- [ ] **Step 1: 安装 Storybook v8**

```bash
yarn add -D storybook @storybook/react-vite @storybook/addon-essentials
yarn remove @storybook/react @storybook/addon-actions @storybook/addon-links @storybook/addons @storybook/preset-create-react-app
```

- [ ] **Step 2: 重写 .storybook/main.js → main.ts**

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
}

export default config
```

- [ ] **Step 3: 重写 .storybook/preview.js**

```jsx
import React from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../src/theme'
import '../src/story.css'

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
]

export const parameters = {
  options: {
    showRoots: true,
  },
}
```

- [ ] **Step 4: 迁移一个示例 stories 文件——Badge**

旧格式 (`badge.stories.js`):
```js
import React from 'react'
import { storiesOf } from '@storybook/react'
import Badge from './index'

storiesOf('Badge', module)
  .add('default', () => <Badge count={3} />)
  .add('dot', () => <Badge show variant="dot" />)
```

新格式 (`badge.stories.jsx`):
```jsx
import React from 'react'
import Badge from './index'

export default {
  title: 'Badge',
  component: Badge,
}

export const Default = () => <Badge count={3} />
export const Dot = () => <Badge show variant="dot" />
```

- [ ] **Step 5: 批量迁移其余 15 个 stories 文件**

对每个 `.stories.js` 文件按同上模式转换。完整清单：
- `Avatar`、`Button`、`ChatBubble`、`ConcatCard`
- `Conversation`、`EditProfile`、`Filter`
- `FilterList`、`Footer`、`Icon`
- `MessageCard`、`NoteCard`、`NoteList`
- `Settings`、`Switch`

每个文件从 `storiesOf()` 格式转为 `export default { title, component }` + 具名导出。

- [ ] **Step 6: 验证 Storybook**

```bash
yarn storybook
```

Expected: Storybook 在 localhost:6006 启动，所有 stories 可正常展示

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Storybook v5 → v8 升级

- @storybook/react-vite + @storybook/addon-essentials
- .storybook/main.ts 配置 Vite 框架
- preview.js decorators 导出模式
- 16 个 stories CSF v1 → CSF v3 格式

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: 搭建后端——Express + Socket.IO

**Files:**
- Create: `server/index.js`
- Create: `server/socket.js`
- Create: `server/data/contacts.json`
- Create: `server/data/.gitkeep`（messages.json 运行时生成）
- Modify: `package.json`（新增 scripts + 依赖）

- [ ] **Step 1: 安装后端依赖**

```bash
yarn add express socket.io cors
```

- [ ] **Step 2: 创建 server/data/contacts.json**

```json
[
  { "id": "1", "name": "林凌", "avatar": "avatar-1", "status": "online", "lastMessage": "忙着写Bug呢" },
  { "id": "2", "name": "小天", "avatar": "avatar-2", "status": "offline", "lastMessage": "Hi～忙什么呢？" },
  { "id": "3", "name": "张三", "avatar": "avatar-1", "status": "online", "lastMessage": "晚上一起吃饭？" },
  { "id": "4", "name": "李四", "avatar": "avatar-2", "status": "offline", "lastMessage": "文件收到了" }
]
```

- [ ] **Step 3: 创建 server/socket.js**

```js
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, 'data')
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json')
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json')

function readJSON (filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return filePath.endsWith('messages.json') ? {} : []
  }
}

function writeJSON (filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

function getMessages () {
  return readJSON(MESSAGES_FILE)
}

function getContacts () {
  return readJSON(CONTACTS_FILE)
}

// rooms: { contactId: [message, ...] }
function addMessage ({ from, to, content, type = 'text', time }) {
  const messages = getMessages()
  const roomKey = [from, to].sort().join('-')
  if (!messages[roomKey]) messages[roomKey] = []
  const msg = {
    id: Date.now().toString(),
    from,
    to,
    content,
    type,
    time: time || new Date().toISOString(),
  }
  messages[roomKey].push(msg)
  // 只保留最近 200 条
  if (messages[roomKey].length > 200) {
    messages[roomKey] = messages[roomKey].slice(-200)
  }
  writeJSON(MESSAGES_FILE, messages)
  return msg
}

function getHistory (user1, user2) {
  const messages = getMessages()
  const roomKey = [user1, user2].sort().join('-')
  return messages[roomKey] || []
}

function setupSocket (io) {
  // userId → socket.id 映射
  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.id}`)

    socket.on('login', ({ userId, name, avatar }) => {
      onlineUsers.set(userId, socket.id)
      socket.userId = userId
      socket.userName = name
      console.log(`[socket] login: ${name} (${userId})`)

      // 广播上线状态
      socket.broadcast.emit('user:online', { userId, name, avatar })
      // 发送联系人列表（含在线状态）
      const contacts = getContacts().map(c => ({
        ...c,
        online: onlineUsers.has(c.id) || c.status === 'online',
      }))
      socket.emit('contacts', contacts)
    })

    socket.on('message:send', ({ to, content, type }, callback) => {
      if (!socket.userId) return
      const msg = addMessage({
        from: socket.userId,
        to,
        content,
        type,
      })

      // 发送给接收方
      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit('message:new', msg)
      }
      // 回执给发送方
      if (callback) callback({ success: true, message: msg })
    })

    socket.on('message:history', ({ with: otherId }, callback) => {
      if (!socket.userId) return
      const history = getHistory(socket.userId, otherId)
      if (callback) callback(history)
    })

    socket.on('typing', ({ to }) => {
      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit('typing', { from: socket.userId, name: socket.userName })
      }
    })

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId)
        socket.broadcast.emit('user:offline', { userId: socket.userId })
        console.log(`[socket] offline: ${socket.userName} (${socket.userId})`)
      }
    })
  })
}

module.exports = { setupSocket }
```

- [ ] **Step 4: 创建 server/index.js**

```js
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { setupSocket } = require('./socket')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

setupSocket(io)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`[server] IM Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 5: 更新 package.json scripts**

```json
{
  "scripts": {
    "server": "node server/index.js",
    "start": "vite",
    "dev": "concurrently \"yarn server\" \"yarn start\"",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

安装 concurrently:
```bash
yarn add -D concurrently
```

- [ ] **Step 6: 验证后端启动**

```bash
yarn server
```

Expected: `[server] IM Server running on http://localhost:4000`

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Express + Socket.IO 后端

- server/index.js: Express 服务 + Socket.IO 初始化
- server/socket.js: 事件处理(login/message:send/history/typing)
- JSON 文件持久化消息和联系人数据
- CORS 配置支持前端开发端口
- concurrently 同时启动前后端

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: 前端通信逻辑——Socket 连接层

**Files:**
- Create: `src/context/SocketContext.jsx`

- [ ] **Step 1: 创建 SocketContext.jsx**

```jsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

const SocketContext = createContext(null)

export function SocketProvider ({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id)
      setConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected:', reason)
      setConnected(false)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [])

  const login = useCallback((user) => {
    const id = user.id || `user-${Date.now()}`
    setUserId(id)
    socketRef.current?.emit('login', {
      userId: id,
      name: user.name,
      avatar: user.avatar,
    })
    return id
  }, [])

  const emit = useCallback((event, data, callback) => {
    if (callback) {
      socketRef.current?.emit(event, data, callback)
    } else {
      socketRef.current?.emit(event, data)
    }
  }, [])

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler)
    return () => socketRef.current?.off(event, handler)
  }, [])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, userId, login, emit, on }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket () {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}
```

- [ ] **Step 2: 安装 socket.io-client**

```bash
yarn add socket.io-client
```

- [ ] **Step 3: 在 App.jsx 中包裹 SocketProvider**

```jsx
import { SocketProvider } from './context/SocketContext'

function App () {
  return (
    <Router>
      <SocketProvider>
        <ThemeProvider theme={theme}>
          <ChatApp />
        </ThemeProvider>
      </SocketProvider>
    </Router>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Socket 连接层——SocketContext

- SocketProvider 管理 WebSocket 连接
- login/emit/on 方法暴露给消费组件
- 自动重连配置
- 包裹在 App.jsx 根级别

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: 前端通信逻辑——消息状态管理

**Files:**
- Create: `src/context/MessageContext.jsx`
- Modify: `src/components/Conversation/index.jsx`
- Modify: `src/components/Footer/index.jsx`
- Modify: `src/components/MessageList/index.jsx`
- Modify: `src/components/ConcatList/index.jsx`

- [ ] **Step 1: 创建 MessageContext.jsx**

```jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSocket } from './SocketContext'

const MessageContext = createContext(null)

export function MessageProvider ({ children }) {
  const { socket, connected, emit, on, userId } = useSocket()
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState({}) // { contactId: [msg, ...] }
  const [activeContactId, setActiveContactId] = useState(null)

  // 监听联系人列表
  useEffect(() => {
    const cleanup = on('contacts', (list) => {
      setContacts(list)
    })
    return cleanup
  }, [on])

  // 监听新消息
  useEffect(() => {
    const cleanup = on('message:new', (msg) => {
      const otherId = msg.from
      setMessages(prev => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), msg],
      }))
    })
    return cleanup
  }, [on])

  // 监听用户上线/下线
  useEffect(() => {
    const onlineCleanup = on('user:online', ({ userId: uid }) => {
      setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: true } : c))
    })
    const offlineCleanup = on('user:offline', ({ userId: uid }) => {
      setContacts(prev => prev.map(c => c.id === uid ? { ...c, online: false } : c))
    })
    return () => { onlineCleanup(); offlineCleanup() }
  }, [on])

  const sendTextMessage = useCallback((content) => {
    if (!activeContactId || !content.trim()) return
    emit('message:send', {
      to: activeContactId,
      content: content.trim(),
      type: 'text',
    }, (res) => {
      if (res?.success) {
        setMessages(prev => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), res.message],
        }))
      }
    })
  }, [activeContactId, emit])

  const loadHistory = useCallback((contactId) => {
    emit('message:history', { with: contactId }, (history) => {
      setMessages(prev => ({
        ...prev,
        [contactId]: history,
      }))
    })
  }, [emit])

  const openConversation = useCallback((contactId) => {
    setActiveContactId(contactId)
    loadHistory(contactId)
    // 更新联系人最后消息时间等
  }, [loadHistory])

  return (
    <MessageContext.Provider value={{
      contacts,
      messages,
      activeContactId,
      connected,
      userId,
      sendTextMessage,
      openConversation,
      loadHistory,
    }}>
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages () {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error('useMessages must be used within MessageProvider')
  return ctx
}
```

- [ ] **Step 2: 更新 App.jsx 包裹 MessageProvider**

```jsx
<Router>
  <SocketProvider>
    <MessageProvider>
      <ThemeProvider theme={theme}>
        <ChatApp />
      </ThemeProvider>
    </MessageProvider>
  </SocketProvider>
</Router>
```

- [ ] **Step 3: 改造 Conversation — 使用真实消息**

```jsx
function Conversation ({ onAvatarClick, onVideoClick, ...rest }) {
    const { messages, activeContactId, userId } = useMessages()
    const currentMessages = activeContactId ? (messages[activeContactId] || []) : []

    // ... useSpring 动画保持不变

    return (
        <StyledConversation {...rest}>
            <TitleBar
                onAvatarClick={onAvatarClick}
                onVideoClick={onVideoClick}
                titleBarAnimation={titleBarAnimation}
            />
            <Conversations as={animated.div} style={coversationAnimation}>
                {currentMessages.map((msg) =>
                    msg.from === userId ? (
                        <MyChatBubble key={msg.id} time={formatTime(msg.time)}>
                            {msg.content}
                        </MyChatBubble>
                    ) : (
                        <ChatBubble key={msg.id} time={formatTime(msg.time)}>
                            {msg.type === 'voice'
                                ? <VoiceMessage time={msg.content} />
                                : msg.content
                            }
                        </ChatBubble>
                    )
                )}
                {currentMessages.length === 0 && (
                    <ChatBubble time=""> 选择一个联系人开始聊天 </ChatBubble>
                )}
            </Conversations>
            <Footer footerAnimation={footerAnimation} />
        </StyledConversation>
    )
}
```

- [ ] **Step 4: 改造 Footer — 发送消息**

```jsx
import { useMessages } from 'context/MessageContext'

function Footer ({ footerAnimation, ...rest }) {
    const [value, setValue] = useState('')
    const { sendTextMessage, activeContactId } = useMessages()

    const handleSend = () => {
        if (value.trim() && activeContactId) {
            sendTextMessage(value)
            setValue('')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <StyledFooter as={animated.div} style={footerAnimation} {...rest}>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={activeContactId ? '输入消息...' : '请先选择联系人'}
                disabled={!activeContactId}
            />
            <button onClick={handleSend} disabled={!activeContactId}>
                <Icon icon={Plane} />
            </button>
        </StyledFooter>
    )
}
```

- [ ] **Step 5: 改造 MessageList — 真实联系人数据**

```jsx
function MessageList ({ ...rest }) {
    const { contacts, openConversation, messages } = useMessages()

    return (
        <StyledMessageList {...rest}>
            {contacts.map((contact) => {
                const contactMsgs = messages[contact.id] || []
                const lastMsg = contactMsgs[contactMsgs.length - 1] || {}
                return (
                    <MessageCard
                        key={contact.id}
                        avatarSrc={getAvatarSrc(contact.avatar)}
                        name={contact.name}
                        status={contact.online ? 'online' : 'offline'}
                        lastMessage={lastMsg.content || contact.lastMessage}
                        onClick={() => openConversation(contact.id)}
                    />
                )
            })}
        </StyledMessageList>
    )
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: 消息状态管理——MessageContext

- MessageProvider 管理联系人/消息/活跃联系人状态
- Conversation 渲染真实消息列表
- Footer 输入提交触发 sendMessage
- MessageList 使用 Socket 返回的联系人数据
- 在线状态实时更新

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: 登录页 + 用户身份

**Files:**
- Create: `src/components/Login/index.jsx`
- Create: `src/components/Login/style.js`

- [ ] **Step 1: 创建 Login 组件**

```jsx
import React, { useState } from 'react'
import StyledLogin from './style'
import Button from 'components/Button'
import Input from 'components/Input'
import { useSocket } from 'context/SocketContext'
import avatarImg1 from 'assets/images/avatar-1.jpg'
import avatarImg2 from 'assets/images/avatar-2.jpg'

const AVATAR_MAP = { 'avatar-1': avatarImg1, 'avatar-2': avatarImg2 }

function Login ({ onLogin }) {
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState('avatar-1')
    const { login } = useSocket()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim()) return
        const userId = login({ name: name.trim(), avatar })
        onLogin({ id: userId, name: name.trim(), avatar })
    }

    return (
        <StyledLogin>
            <div className="login-card">
                <h1>React IM</h1>
                <p>输入昵称开始聊天</p>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="你的昵称"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                    />
                    <div className="avatar-select">
                        {Object.entries(AVATAR_MAP).map(([key, src]) => (
                            <img
                                key={key}
                                src={src}
                                alt={key}
                                className={avatar === key ? 'selected' : ''}
                                onClick={() => setAvatar(key)}
                            />
                        ))}
                    </div>
                    <Button type="submit" disabled={!name.trim()}>
                        进入聊天
                    </Button>
                </form>
            </div>
        </StyledLogin>
    )
}

export default Login
```

- [ ] **Step 2: 创建 Login 样式**

```jsx
import styled from 'styled-components'

const StyledLogin = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: ${({ theme }) => theme.background};

    .login-card {
        width: 360px;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        text-align: center;

        h1 {
            font-size: 28px;
            margin-bottom: 8px;
        }

        p {
            color: ${({ theme }) => theme.inactiveColor};
            margin-bottom: 24px;
        }
    }

    .avatar-select {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin: 16px 0;

        img {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid transparent;
            transition: all 0.2s;

            &.selected {
                border-color: ${({ theme }) => theme.primaryColor};
            }
        }
    }
`

export default StyledLogin
```

- [ ] **Step 3: 在 ChatApp 中集成登录逻辑**

在 ChatApp 中添加登录状态判定：
```jsx
const [user, setUser] = useState(null)

if (!user) {
    return <Login onLogin={setUser} />
}
// 否则渲染聊天界面
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 登录页——用户身份管理

- Login 组件: 输入昵称+选择头像
- 登录后通过 SocketContext.login 建立连接
- ChatApp 判定登录状态
- 头像二选一切换效果

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 10: FontAwesome 升级 + 收尾修复

**Files:**
- Modify: `package.json`
- Modify: 所有引用 FontAwesome 图标的文件

- [ ] **Step 1: 升级 FontAwesome**

```bash
yarn add @fortawesome/fontawesome-svg-core@latest \
         @fortawesome/free-solid-svg-icons@latest \
         @fortawesome/free-regular-svg-icons@latest \
         @fortawesome/free-brands-svg-icons@latest \
         @fortawesome/react-fontawesome@latest
```

- [ ] **Step 2: 验证全量构建**

```bash
yarn build
```

Expected: 构建成功，无错误

- [ ] **Step 3: 端到端手动验证**

```bash
# 终端 1：启动后端
yarn server

# 终端 2：启动前端
yarn start
```

Expected:
- 打开浏览器 → 显示登录页
- 输入昵称 → 进入聊天界面
- 左侧联系人列表加载
- 点击联系人 → 聊天面板显示（空对话）
- 输入消息发送 → 消息出现在聊天面板

- [ ] **Step 4: 最终 Commit**

```bash
git add -A
git commit -m "feat: FontAwesome 升级 + 收尾修复

- FontAwesome v5 → v6
- 全局构建验证通过
- 前后端联调确认

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 实施顺序

```
Task 1 (准备工作) → Task 2 (Vite) → Task 3 (React 18) → Task 4 (动画/样式)
  → Task 5 (Storybook) → Task 6 (后端) → Task 7 (Socket层)
    → Task 8 (消息状态) → Task 9 (登录页) → Task 10 (收尾)
```

每步完成必须通过构建验证 (`yarn build`)，确保不引入回归。每步独立 commit，便于问题定位和回退。
