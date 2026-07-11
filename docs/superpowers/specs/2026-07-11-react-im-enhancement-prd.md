# React-IM 产品增强 PRD

**版本**：v1.0  
**日期**：2026-07-11  
**作者**：产品经理  
**状态**：待评审  

---

## 1. 概述

### 1.1 背景

React-IM 是一款基于 React 18 + Socket.IO 的实时即时通讯 Web 应用。当前已完成核心消息收发链路（文字/语音/表情 + 实时在线状态 + 聊天历史），但存在**7个功能通路断裂**和**4处纯占位数据**，导致产品体验不完整。

### 1.2 目标

分两期完善产品：

| 阶段 | 目标 | 交付标准 |
|------|------|---------|
| **一期** | 修复缺陷，打通全部已有功能的体验链路 | 所有UI控件有实际效果，数据流完整闭环 |
| **二期** | 增强IM核心体验 | 消息引用、图片发送、@提及、消息撤回等 |

---

## 2. 当前状态分析

### 2.1 已完成功能（可用）

| 功能 | 涉及组件 |
|------|---------|
| 昵称+头像登录 | `Login` → `SocketContext.login()` |
| 文字消息收发 | `Footer` → `MessageContext.sendTextMessage()` → `server/socket.js` |
| 语音消息录制/发送/播放 | `Footer` + `VoiceMessage` + `useVoiceRecorder` |
| Emoji 选择器（9分类，光标插入） | `Footer.EmojiPickerContent` |
| 最近会话列表（点击进入聊天） | `MessageList` + `MessageCard` |
| 实时在线状态推送 | `MessageContext` ↔ `server/socket.js` |
| 聊天历史持久化（JSON文件，200条上限） | `server/socket.js` ↔ `messages.json` |

### 2.2 一期需修复的缺陷

| # | 缺陷描述 | 影响 | 涉及组件 |
|---|---------|------|---------|
| D1 | **联系人列表点击不进入聊天** | 用户从通讯录找不到发起对话的入口 | `ConcatCard` |
| D2 | **设置页开关全部无实际效果** | 关闭通知仍弹提醒，用户不信任设置 | `Settings` |
| D3 | **标题栏下拉菜单功能缺失** | "关闭会话"不关闭，"屏蔽此人"不屏蔽 | `TitleBar` |
| D4 | **切换会话后输入内容丢失** | 用户切出去回个消息，之前写的内容没了 | `Footer` |
| D5 | **未读计数永远为0** | 有新消息时侧边栏无感知 | `MessageCard` |
| D6 | **消息搜索框不搜索** | 大搜索框在上面但搜不了任何东西 | `FilterList` |
| D7 | **在线状态变化无浮窗提醒** | 好友上线/下线用户不知道 | `MessageContext` |
| D8 | **个人资料编辑不持久化** | 编辑完刷新就丢失 | `EditProfile` |

### 2.3 新增功能（一期）

| # | 功能 | 优先级 |
|---|------|--------|
| N1 | Toast 通知系统（上线/下线/新消息/错误提示） | P0 |
| N2 | 输入框高度自适应（多行文本） | P1 |

### 2.4 二期增强功能

| # | 功能 | 说明 |
|---|------|------|
| E1 | 消息引用回复 | 引用某条消息后回复，显示被引用内容 |
| E2 | 图片发送 | 点击 clip 图标选择图片发送（base64） |
| E3 | @提及提醒 | 输入@弹出联系人选择器 |
| E4 | 消息撤回 | 发送者2分钟内可撤回 |
| E5 | 消息已读回执 | 对方已读后显示"已读"标记 |
| E6 | 快捷键 | `Ctrl+Enter` 发送，`Esc` 关闭会话 |

---

## 3. 一期需求详情

### 3.1 D1 — 联系人列表点击发起聊天

**当前**：`ConcatList` → `ConcatCard` 渲染联系人卡片，无点击回调。  
**期望**：点击联系人卡片 → 切换到该联系人聊天。

**实现**：
- `ConcatCard` 增加 `onClick` prop
- `ConcatList` 调用 `useMessages().openConversation(contact.id)`
- 同时导航到 `/` （或保持当前路由，sidebar 切换到消息列表）

**验收**：通讯录点任意联系人 → 进入聊天界面 → 可收发消息。

---

### 3.2 D2 — 设置页开关生效

**当前**：`Settings` 中 7 个 `Switch` 组件没有 `checked`/`onChange` 状态。  
**期望**：每个开关有实际效果并持久化。

**实现**：
- 新增 `hooks/useSettings.js`：
  - 从 localStorage 读写设置项
  - 提供 `settings` 对象 + `updateSetting(key, value)` 方法
- 设置项：

```
newMessageNotification: true   // 新消息通知（二期控制桌面通知）
voiceVideoAlert: true           // 语音视频提醒
showNotificationDetail: true    // 显示通知详情
sound: true                     // 声音（消息提示音）
friendVerification: true        // 添加好友验证（前端开关，后端预留）
recommendContacts: true         // 推荐通讯录好友
findByPhone: false              // 只能通过手机号找到我
```

- `Settings` 组件读取 `useSettings()` 绑定到每个 `Switch`

**验收**：开关状态在页面刷新后保持，每个开关可切换。

---

### 3.3 D3 — 标题栏下拉菜单功能

**当前**：`TitleBar` 的 `Dropdown` 菜单项："个人资料"、"关闭会话"、"屏蔽此人"均无实际回调。  
**期望**：

| 菜单项 | 行为 |
|--------|------|
| 个人资料 | 打开右侧资料抽屉（已有 `onAvatarClick` 通路） |
| 关闭会话 | 清空 `activeContactId`，回到空聊天界面 |
| 屏蔽此人 | 将联系人加入屏蔽列表（localStorage），过滤其消息 |

**实现**：
- `TitleBar` 增加 props：`onCloseConversation`、`onBlockContact`
- `Conversation` 提供回调，调用 context 方法
- 新增 `hooks/useBlockedList.js`：管理屏蔽列表（localStorage 存储 ID 数组）
- `MessageContext` 的 `message:new` 监听器中过滤被屏蔽用户的消息

**验收**：点"关闭会话"→ 聊天区清空；点"屏蔽此人"→ 不再收到该人消息，可在设置 > 屏蔽列表查看。

---

### 3.4 D4 — 草稿保存

**当前**：切换会话后 `inputValue` 随 `Footer` 卸载丢失。  
**期望**：切换会话 → 回来时输入框恢复之前的内容。

**实现**：
- 新增 `hooks/useDrafts.js`：
  - `drafts` 对象（key = contactId，value = 草稿文本）
  - `saveDraft(contactId, text)` → 存入内存 Map
  - `getDraft(contactId)` → 返回草稿文本或空字符串
  - `clearDraft(contactId)` → 消息发送成功后清除
- `Footer` 组件：
  - 初始化时从 `drafts[activeContactId]` 恢复文本
  - `inputValue` 变化时调用 `saveDraft`
  - `handleSend` 成功后调用 `clearDraft`

**验收**：在聊天A输入"测试" → 切换到聊天B → 切回聊天A → 输入框显示"测试"。

---

### 3.5 D5 — 未读计数

**当前**：`MessageCard` 的 `unreadCount` 硬编码为 0。  
**期望**：当用户未打开某会话时收到新消息，对应 MessageCard 显示未读角标。

**实现**：
- `MessageContext` 新增状态：`unreadCounts`（对象，key = contactId，value = 数字）
- `message:new` 监听器：如果 `msg.from !== activeContactId`，对应计数 +1
- `openConversation` 调用时：将对应计数清零
- `MessageList`：传递 `unreadCounts[contact.id] || 0` 给 MessageCard

**验收**：选中联系人A → 联系人B发来消息 → 侧边栏B显示红色未读角标 → 点击B → 角标消失。

---

### 3.6 D6 — 消息搜索

**当前**：`FilterList` 有 `Input.Search` 但无搜索逻辑。  
**期望**：在 MessageList 中搜索框输入关键词 → 实时过滤联系人/消息。

**实现**：
- `FilterList` 增加 `onSearch` prop，将 `Input.Search` 的 `onChange` 事件暴露给父组件
- `MessageList` 过滤逻辑：
  - 搜索联系人姓名匹配 → 显示匹配的联系人
  - 搜索消息内容匹配 → 显示最近一条匹配消息的联系人
- 搜索结果实时更新（前端过滤，不请求后端）

**验收**：输入"林"→ 只显示"林凌"；输入"hello"→ 显示最近消息含"hello"的联系人。

---

### 3.7 D7 — 在线状态变更通知

**当前**：`user:online`/`user:offline` 事件只更新状态，不通知用户。  
**期望**：好友上下线时弹出短暂提示。

**实现**：
- 新增 `components/Toast/index.jsx` 轻量 toast 组件
- 位置：右下角固定定位，3秒自动消失
- 类型：`info`（蓝）、`success`（绿）、`warning`（橙）、`error`（红）
- 搭配 `hooks/useToast.js`：
  - `toasts` 数组状态
  - `showToast(message, type)` → 加入队列，3秒后自动移除
- `MessageContext` 的 `user:online`/`user:offline` 监听器中调用 `showToast`

**验收**：好友上线 → 右下角出现"林凌 上线了"蓝色提示，3秒后消失。

---

### 3.8 D8 — 个人资料持久化

**当前**：`EditProfile` 编辑后切回视图模式，刷新即丢失。  
**期望**：编辑保存后刷新页面，信息仍在。

**实现**：
- `hooks/useProfile.js`：
  - 从 localStorage 读写 `{ name, gender, region, signature, phone, email, website, social }` 
  - 提供 `profile` 对象 + `updateProfile(fields)` 方法
- `EditProfile` 绑定 `useProfile()` 状态
- `Profile` 读取 `useProfile()` 显示数据（替代硬编码）

**验收**：编辑昵称 → 点确认 → 刷新 → 昵称保持新值。

---

### 3.9 N1 — Toast 通知系统

与 D7 共用同一个 Toast 基础设施：

| 触发场景 | 消息 | 类型 |
|---------|------|------|
| 好友上线 | "XXX 上线了" | info |
| 好友下线 | "XXX 离线了" | info |
| 消息发送失败 | "消息发送失败，请重试" | error |
| 文件发送成功（二期） | "图片发送成功" | success |
| 网络断开 | "连接断开，正在重连..." | warning |
| 网络恢复 | "已重新连接" | success |

**组件结构**：
```
components/Toast/
  index.jsx          — ToastProvider + ToastContainer
  style.js           — 动画 + 定位样式
hooks/useToast.js    — showToast(message, type), toasts 状态
```

**验收**：以上6种场景均能正确弹出提示。

---

### 3.10 N2 — 输入框高度自适应

**当前**：`Footer` 的 `Input` 固定 48px 单行。长文本时滚动极差。  
**期望**：输入框最小1行，最多4行，超出滚动；Enter 发送，Shift+Enter 换行。

**实现**：
- `Input` 增加 `multiline` 属性，切换为 `<textarea>` 渲染
- `Footer` 传入 `multiline` + `rows={1}`，CSS 设置 `min-height: 48px; max-height: 120px; resize: none`
- `handleKeyDown` 中：`Enter` 且无 Shift → 发送；`Shift+Enter` → 换行

**验收**：输入3行文本 → 框自动扩展 → Enter 发送 → 框恢复1行。

---

## 4. 二期需求详情

### 4.1 E1 — 消息引用回复

**交互**：长按/右键消息 → 点击"引用" → 被引用消息显示在输入框上方 → 输入回复 → 发送。

**数据格式**：
```
msg: {
  type: 'text',
  content: '回复内容',
  quote: { id, from, content, type }
}
```

**渲染**：被引用消息显示为气泡内的小卡片（缩略内容 + 作者名）。

---

### 4.2 E2 — 图片发送

**交互**：点击 clip 图标 → 文件选择器（`accept="image/*"`）→ 选图后预览 → 发送 base64。

**数据格式**：
```
msg: {
  type: 'image',
  content: 'data:image/...',
  thumbnail: 'data:image/...'  // 缩略图（压缩后）
}
```

**渲染**：`ChatBubble` 内渲染 `<img>`（max-width: 200px），点击可放大。

---

### 4.3 E3 — @提及提醒

**交互**：输入 `@` → 弹出联系人列表浮窗 → 选择联系人 → 插入 `@林凌 ` → 发送。

**渲染**：消息中 `@林凌` 高亮显示（蓝色）；被 @ 的用户收到特殊提醒。

---

### 4.4 E4 — 消息撤回

**交互**：发送者2分钟内可撤回自己的消息 → 消息变为"你撤回了一条消息"或"对方撤回了一条消息"。

**实现**：
- Server 增加 `message:revoke` 事件
- 广播 `message:revoked` 给双方
- 被撤回消息在 UI 显示撤回提示文本

---

### 4.5 E5 — 消息已读回执

**交互**：对方打开有自己消息的会话 → 消息下方显示"已读"。

**实现**：
- Server 增加 `message:read` 事件
- Client 在 `openConversation` 时向上一条对方消息的发送者发送已读回执

---

### 4.6 E6 — 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Enter` | 发送消息 |
| `Shift+Enter` | 换行（输入框内） |
| `Esc` | 关闭当前会话 |
| `Ctrl+K` | 聚焦搜索框 |

---

## 5. 架构设计

### 5.1 新增 Context/Hook 层

```
现有层：
  SocketProvider → MessageProvider → 组件树

一期新增：
  SocketProvider → MessageProvider
    ├── useSettings()     — localStorage 持久化设置
    ├── useDrafts()       — 草稿缓存（内存 Map）
    ├── useBlockedList()  — 屏蔽列表（localStorage）
    ├── useProfile()      — 个人资料（localStorage）
    └── ToastProvider     — 全局 Toast 通知
      → 组件树
```

### 5.2 数据流

```
设置变更:    Settings → updateSetting() → localStorage + state → 重新渲染
草稿保存:    Footer   → saveDraft()      → 内存 Map（切换会话时保留）
屏蔽操作:    TitleBar → blockContact()    → localStorage + 过滤 message:new
Toast:       任意组件  → showToast()       → ToastProvider → 3秒后自动移除
搜索:        FilterList → onSearch        → 父组件本地过滤（无服务端请求）
```

### 5.3 文件清单（一期）

| 文件 | 类型 | 说明 |
|------|------|------|
| `src/hooks/useSettings.js` | 新增 | 设置项读写，localStorage 持久化 |
| `src/hooks/useDrafts.js` | 新增 | 草稿缓存，内存 Map |
| `src/hooks/useBlockedList.js` | 新增 | 屏蔽列表管理 |
| `src/hooks/useProfile.js` | 新增 | 个人资料持久化 |
| `src/hooks/useToast.js` | 新增 | Toast 状态管理 |
| `src/components/Toast/index.jsx` | 新增 | Toast 通知组件 |
| `src/components/Toast/style.js` | 新增 | Toast 样式 |
| `src/components/FilterList/index.jsx` | 修改 | 增加 onSearch prop |
| `src/components/Settings/index.jsx` | 修改 | 绑定 useSettings |
| `src/components/TitleBar/index.jsx` | 修改 | 菜单项回调 |
| `src/components/ConcatCard/index.jsx` | 修改 | 增加 onClick prop |
| `src/components/ConcatList/index.jsx` | 修改 | 点击发起聊天 |
| `src/components/MessageList/index.jsx` | 修改 | 搜索过滤 + 未读计数 |
| `src/components/Footer/index.jsx` | 修改 | 草稿恢复/保存/清除 + 多行输入 |
| `src/components/Conversation/index.jsx` | 修改 | 关闭会话回调 |
| `src/components/EditProfile/index.jsx` | 修改 | 绑定 useProfile |
| `src/components/Profile/index.jsx` | 修改 | 读取 useProfile 数据 |
| `src/context/MessageContext.jsx` | 修改 | 未读计数 + 屏蔽过滤 + Toast |
| `src/App.jsx` | 修改 | 包裹 ToastProvider |
| `src/components/Input/index.jsx` | 修改 | multiline textarea 支持 |

---

## 6. 验收标准

### 6.1 一期验收清单

- [ ] 联系人列表点击可进入聊天
- [ ] 设置页7个开关全部有实际效果，刷新后保持
- [ ] 标题栏"关闭会话"可清空聊天区
- [ ] 标题栏"屏蔽此人"可过滤消息并在屏蔽列表显示
- [ ] 切换会话草稿不丢失
- [ ] 未读消息显示角标（数量），打开后清零
- [ ] 消息搜索可实时过滤联系人
- [ ] 好友上下线有 toast 提示
- [ ] 个人资料编辑后刷新不丢失
- [ ] 输入框支持多行（1-4行），Shift+Enter 换行
- [ ] 消息发送/网络变化有 toast 提示

### 6.2 二期验收清单

- [ ] 可引用消息后回复
- [ ] 可发送图片（选择、预览、发送、点击放大）
- [ ] @提及弹出选人浮窗
- [ ] 2分钟内可撤回消息
- [ ] 对方打开会话后显示已读回执
- [ ] Ctrl+Enter 发送，Esc 关闭会话，Ctrl+K 聚焦搜索

---

## 7. 风险与约束

| 风险 | 缓解措施 |
|------|---------|
| localStorage 容量（5MB） | 图片 base64 不做本地存储，设置/资料等可忽略不计 |
| 草稿仅前端缓存 | 明确告知：换浏览器/清缓存会丢失草稿 |
| 二期图片 base64 传输大 | 单张限制 500KB，超过提示压缩或取消 |
| 未读计数仅前端状态 | 已在服务端消息落盘，前端计数为辅助体验，不追求分布式一致性 |
