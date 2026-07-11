const { createUser, getContacts, getContact, addMessage, getHistory, revokeMessage } = require('./db/models')

function setupSocket (io) {
  // userId → Set of socketIds (support multiple tabs/devices)
  const onlineUsers = new Map()

  function emitToUser (userId, event, data) {
    const sockets = onlineUsers.get(userId)
    if (sockets) {
      for (const sid of sockets) {
        io.to(sid).emit(event, data)
      }
    }
  }

  function isOnline (userId) {
    const sockets = onlineUsers.get(userId)
    return sockets != null && sockets.size > 0
  }

  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.id}`)

    socket.on('login', ({ userId, name, avatar }) => {
      if (!userId) return
      createUser({ id: userId, name, avatar })

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set())
      }
      const wasOffline = onlineUsers.get(userId).size === 0
      onlineUsers.get(userId).add(socket.id)

      socket.userId = userId
      socket.userName = name
      console.log(`[socket] login: ${name} (${userId})`)

      if (wasOffline) {
        socket.broadcast.emit('user:online', { userId, name, avatar })
      }

      const contacts = getContacts().map(c => ({
        ...c,
        online: isOnline(c.id),
      }))
      socket.emit('contacts', contacts)
    })

    socket.on('message:send', ({ to, content, type, duration, quote }, callback) => {
      if (!socket.userId || !to) return

      try {
        const msg = addMessage({
          from: socket.userId,
          to,
          content: content || '',
          type: type || 'text',
          duration,
          quoteId: quote?.id || null,
        })

        emitToUser(to, 'message:new', msg)
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
        emitToUser(to, 'message:revoked', { messageId })
      }
      if (callback) callback(result)
    })

    socket.on('message:read', ({ from, messageId }) => {
      emitToUser(from, 'message:read', { messageId, readBy: socket.userId })
    })

    socket.on('typing', ({ to }) => {
      emitToUser(to, 'typing', { from: socket.userId, name: socket.userName })
    })

    socket.on('disconnect', () => {
      if (socket.userId && onlineUsers.has(socket.userId)) {
        onlineUsers.get(socket.userId).delete(socket.id)
        if (onlineUsers.get(socket.userId).size === 0) {
          onlineUsers.delete(socket.userId)
          socket.broadcast.emit('user:offline', { userId: socket.userId })
        }
        console.log(`[socket] offline: ${socket.userName} (${socket.userId})`)
      }
    })
  })
}

module.exports = { setupSocket }
