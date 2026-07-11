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

function addMessage ({ from, to, content, type = 'text', time, duration, quote }) {
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
  // 语音消息携带时长信息
  if (duration != null) {
    msg.duration = duration
  }
  if (quote) msg.quote = quote
  messages[roomKey].push(msg)
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
  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.id}`)

    socket.on('login', ({ userId, name, avatar }) => {
      onlineUsers.set(userId, socket.id)
      socket.userId = userId
      socket.userName = name
      console.log(`[socket] login: ${name} (${userId})`)

      socket.broadcast.emit('user:online', { userId, name, avatar })
      const contacts = getContacts().map(c => ({
        ...c,
        online: onlineUsers.has(c.id) || c.status === 'online',
      }))
      socket.emit('contacts', contacts)
    })

    socket.on('message:send', ({ to, content, type, duration, quote }, callback) => {
      if (!socket.userId) return
      const msg = addMessage({
        from: socket.userId,
        to,
        content,
        type,
        duration,
        quote,
      })

      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit('message:new', msg)
      }
      if (callback) callback({ success: true, message: msg })
    })

    socket.on('message:history', ({ with: otherId }, callback) => {
      if (!socket.userId) return
      const history = getHistory(socket.userId, otherId)
      if (callback) callback(history)
    })

    // 消息撤回（2分钟内）
    socket.on('message:revoke', ({ messageId, to }, callback) => {
        if (!socket.userId) return
        const messages = getMessages()
        const roomKey = [socket.userId, to].sort().join('-')
        const roomMessages = messages[roomKey] || []
        const msg = roomMessages.find(m => m.id === messageId)

        if (!msg || msg.from !== socket.userId) {
          if (callback) callback({ success: false, error: '无权撤回' })
          return
        }

        const elapsed = Date.now() - new Date(msg.time).getTime()
        if (elapsed > 2 * 60 * 1000) {
          if (callback) callback({ success: false, error: '超过2分钟无法撤回' })
          return
        }

        msg.revoked = true
        writeJSON(MESSAGES_FILE, messages)

        const targetSocketId = onlineUsers.get(to)
        if (targetSocketId) {
          io.to(targetSocketId).emit('message:revoked', { messageId, roomKey })
        }
        if (callback) callback({ success: true, message: msg })
    })

    // 已读回执
    socket.on('message:read', ({ from, messageId }) => {
        const targetSocketId = onlineUsers.get(from)
        if (targetSocketId) {
          io.to(targetSocketId).emit('message:read', { messageId, readBy: socket.userId })
        }
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
