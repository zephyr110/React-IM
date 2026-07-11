const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { setupSocket } = require('./socket')
const { getDb } = require('./db')
const { getUser, getContacts, getHistory } = require('./db/models')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// 初始化数据库
getDb()
console.log('[db] SQLite database initialized')

// ====== REST API Routes ======

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Get all contacts
app.get('/api/contacts', (req, res) => {
  res.json(getContacts())
})

// Get user info
app.get('/api/users/:id', (req, res) => {
  const user = getUser(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

// Get message history between two users
app.get('/api/messages/:user1/:user2', (req, res) => {
  const messages = getHistory(req.params.user1, req.params.user2)
  res.json(messages)
})

// ====== Socket.IO ======
setupSocket(io)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`[server] IM Server running on http://localhost:${PORT}`)
})
