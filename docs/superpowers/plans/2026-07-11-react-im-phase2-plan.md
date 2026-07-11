# React-IM 二期增强 实施计划

**Goal:** 实现消息引用回复、图片发送、@提及、消息撤回、已读回执、快捷键

**Architecture:** 扩展 server socket 事件（revoke/read），增强 MessageContext（quote/image/mention 发送），Foot 增加引用栏和图片选择，ChatBubble 渲染新消息类型

---

### Task E1: Server 增加 revoke + read 事件

**Files:**
- Modify: `server/socket.js`

在 `message:send` 处理之后添加：

```javascript
// 消息撤回
socket.on('message:revoke', ({ messageId, to }, callback) => {
    if (!socket.userId) return
    const messages = getMessages()
    const roomKey = [socket.userId, to].sort().join('-')
    const roomMessages = messages[roomKey] || []
    const msg = roomMessages.find(m => m.id === messageId)
    if (msg && msg.from === socket.userId) {
        const elapsed = Date.now() - new Date(msg.time).getTime()
        if (elapsed > 2 * 60 * 1000) {
            if (callback) callback({ success: false, error: '超过2分钟无法撤回' })
            return
        }
        msg.revoked = true
        msg.content = ''
        writeJSON(MESSAGES_FILE, messages)
        const targetSocketId = onlineUsers.get(to)
        if (targetSocketId) {
            io.to(targetSocketId).emit('message:revoked', { messageId, roomKey })
        }
        if (callback) callback({ success: true })
    }
})

// 已读回执
socket.on('message:read', ({ from, messageId }) => {
    const targetSocketId = onlineUsers.get(from)
    if (targetSocketId) {
        io.to(targetSocketId).emit('message:read', { messageId, readBy: socket.userId })
    }
})
```

---

### Task E2: MessageContext 扩展（quote/image/mention/revoke/read）

**Files:**
- Modify: `src/context/MessageContext.jsx`

新增方法：sendImageMessage, sendTextMessage 支持 quote

新监听器：message:revoked, message:read

---

### Task E3: Footer 引用栏 + 图片选择

**Files:**
- Modify: `src/components/Footer/index.jsx`
- Modify: `src/components/Footer/style.js`

- 引用栏：显示被引用消息缩略，可取消
- Clip 图标：点击选择图片 → 预览 → 发送
- Ctrl+Enter 发送

---

### Task E4: ChatBubble 渲染增强

**Files:**
- Modify: `src/components/ChatBubble/index.jsx`
- Modify: `src/components/ChatBubble/style.js`

- 引用消息卡片
- 图片消息（<img>）
- 撤回消息提示
- 已读标记
- @高亮
- 右键菜单（引用）

---

### Task E5: Conversation 快捷键 + 已读发送

**Files:**
- Modify: `src/components/Conversation/index.jsx`

- Esc 关闭会话
- Ctrl+K 聚焦搜索（通过 ref/事件）
- 打开会话时发送已读回执

---

### Task E6: 构建验证

**Files:** none (build + test)
