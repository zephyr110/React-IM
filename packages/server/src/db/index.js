const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '..', 'data', 'im.db')

let db

function getDb () {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
    seedContacts(db)
  }
  return db
}

function initSchema (db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT 'avatar-1',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT 'avatar-1',
      intro TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      room_key TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'text',
      duration INTEGER,
      quote_id TEXT,
      revoked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (quote_id) REFERENCES messages(id)
    );

    CREATE INDEX IF NOT EXISTS idx_messages_room_key ON messages(room_key);
    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
  `)
}

function seedContacts (db) {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM contacts').get()
  if (count.cnt > 0) return

  const insert = db.prepare(
    'INSERT OR IGNORE INTO contacts (id, name, avatar, intro) VALUES (?, ?, ?, ?)'
  )
  const seedData = [
    ['1', '林凌', 'avatar-1', '忙着写Bug呢'],
    ['2', '小天', 'avatar-2', 'Hi～忙什么呢？'],
    ['3', '张三', 'avatar-1', '晚上一起吃饭？'],
    ['4', '李四', 'avatar-2', '文件收到了'],
  ]
  const tx = db.transaction(() => {
    for (const row of seedData) insert.run(...row)
  })
  tx()
}

module.exports = { getDb }
