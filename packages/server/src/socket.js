const { createUser, getContacts, getContact, addMessage, getHistory, revokeMessage } = require('./db/models')

function setupSocket (io) {
  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.id}`)

    socket.on('login', ({ userId, name, avatar }) => {
      // 创建或更新用户
      createUser({ id: userId, name, avatar })

      onlineUsers.set(userId, socket.id)
      socket.userId = userId
      socket.userName = name
      console.log(`[socket] login: ${name} (${userId})`)

      socket.broadcast.emit('user:online', { userId, name, avatar })

      // 返回联系人列表（附带在线状态）
      const contacts = getContacts().map(c => ({
        ...c,
        online: onlineUsers.has(c.id),
      }))
      socket.emit('contacts', contacts)
    })

    socket.on('message:send', ({ to, content, type, duration, quote }, callback) => {
      if (!socket.userId) return

      try {
        const msg = addMessage({
          from: socket.userId,
          to,
          content: content || '',
          type: type || 'text',
          duration,
          quoteId: quote?.id || null,
        })

        const targetSocketId = onlineUsers.get(to)
        if (targetSocketId) {
          io.to(targetSocketId).emit('message:new', msg)
        }
        if (callback) callback({ success: true, message: msg })
      } catch (err) {
        console.error('[socket] message:send error:', err)
        if (callback) callback({ success: false, error: err.message })
      }
    })

    socket.on('message:history', ({ with: otherId }, callback) => {
      if (!socket.userId) return
      const history = getHistory(socket.userId, otherId)
      if (callback) callback(history)
    })

    socket.on('message:revoke', ({ messageId, to }, callback) => {
      if (!socket.userId) return

      const result = revokeMessage(messageId, socket.userId)
      if (result.success) {
        const targetSocketId = onlineUsers.get(to)
        if (targetSocketId) {
          io.to(targetSocketId).emit('message:revoked', { messageId })
        }
      }
      if (callback) callback(result)
    })

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
