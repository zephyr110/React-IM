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

    socket.on('message:send', ({ to, content, type }, callback) => {
      if (!socket.userId) return
      const msg = addMessage({
        from: socket.userId,
        to,
        content,
        type,
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
