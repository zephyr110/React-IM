const { getDb } = require('./index')

// ========== Users ==========

function createUser (user) {
  const db = getDb()
  const stmt = db.prepare(
    'INSERT OR REPLACE INTO users (id, name, avatar) VALUES (?, ?, ?)'
  )
  stmt.run(user.id, user.name, user.avatar || 'avatar-1')
  return { id: user.id, name: user.name, avatar: user.avatar || 'avatar-1' }
}

function getUser (id) {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) || null
}

// ========== Contacts ==========

function getContacts () {
  const db = getDb()
  return db.prepare('SELECT * FROM contacts').all()
}

function getContact (id) {
  const db = getDb()
  return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) || null
}

// ========== Messages ==========

function addMessage ({ from, to, content, type = 'text', duration, quoteId }) {
  const db = getDb()
  const id = require('crypto').randomUUID()
  const roomKey = [from, to].sort().join('-')
  const time = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO messages (id, room_key, sender_id, receiver_id, content, type, duration, quote_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(id, roomKey, from, to, content, type, duration || null, quoteId || null, time)

  // Keep max 200 messages per room
  const count = db.prepare(
    'SELECT COUNT(*) as cnt FROM messages WHERE room_key = ?'
  ).get(roomKey)
  if (count.cnt > 200) {
    const excess = count.cnt - 200
    db.prepare(`
      DELETE FROM messages WHERE id IN (
        SELECT id FROM messages WHERE room_key = ? ORDER BY created_at ASC LIMIT ?
      )
    `).run(roomKey, excess)
  }

  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id)
  return formatMessage(msg)
}

function getHistory (user1, user2) {
  const db = getDb()
  const roomKey = [user1, user2].sort().join('-')
  return db.prepare(
    'SELECT * FROM messages WHERE room_key = ? ORDER BY created_at ASC'
  ).all(roomKey).map(formatMessage)
}

function revokeMessage (messageId, userId) {
  const db = getDb()
  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId)
  if (!msg) return { success: false, error: '消息不存在' }
  if (msg.sender_id !== userId) return { success: false, error: '无权撤回' }

  const elapsed = Date.now() - new Date(msg.created_at).getTime()
  if (elapsed > 2 * 60 * 1000) return { success: false, error: '超过2分钟无法撤回' }

  db.prepare('UPDATE messages SET revoked = 1, content = ? WHERE id = ?')
    .run('', messageId)

  return { success: true, message: formatMessage(db.prepare(
    'SELECT * FROM messages WHERE id = ?').get(messageId)) }
}

function getMessage (id) {
  const db = getDb()
  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id)
  return msg ? formatMessage(msg) : null
}

// ========== Helpers ==========

function formatMessage (row) {
  if (!row) return null
  const msg = {
    id: row.id,
    from: row.sender_id,
    to: row.receiver_id,
    content: row.content,
    type: row.type,
    time: row.created_at,
  }
  if (row.duration != null) msg.duration = row.duration
  if (row.quote_id) {
    const quoted = getMessage(row.quote_id)
    if (quoted) msg.quote = { id: quoted.id, from: quoted.from, content: quoted.content, type: quoted.type }
  }
  if (row.revoked) msg.revoked = true
  return msg
}

module.exports = {
  createUser,
  getUser,
  getContacts,
  getContact,
  addMessage,
  getHistory,
  revokeMessage,
  getMessage,
}
