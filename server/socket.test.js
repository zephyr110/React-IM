import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'

const TEST_DIR = path.join(__dirname, '..', 'test-tmp')
const MESSAGES_FILE = path.join(TEST_DIR, 'messages.json')
const CONTACTS_FILE = path.join(TEST_DIR, 'contacts.json')

// Create a test version of the socket module with test paths
function setupTestModule() {
  const DATA_DIR = TEST_DIR
  const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json')
  const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json')

  function readJSON(filePath) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch {
      return filePath.endsWith('messages.json') ? {} : []
    }
  }

  function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  function getMessages() {
    return readJSON(MESSAGES_FILE)
  }

  function getContacts() {
    return readJSON(CONTACTS_FILE)
  }

  function addMessage({ from, to, content, type = 'text', time }) {
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

  function getHistory(user1, user2) {
    const messages = getMessages()
    const roomKey = [user1, user2].sort().join('-')
    return messages[roomKey] || []
  }

  return { addMessage, getHistory, getMessages, getContacts }
}

describe('Server Socket Utilities', () => {
  const { addMessage, getHistory, getMessages } = setupTestModule()

  beforeEach(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true })
    }
    // Clean messages file
    try { fs.unlinkSync(MESSAGES_FILE) } catch {}
  })

  afterEach(() => {
    try { fs.unlinkSync(MESSAGES_FILE) } catch {}
    try { fs.rmdirSync(TEST_DIR) } catch {}
  })

  it('addMessage creates a message and persists it', () => {
    const msg = addMessage({
      from: 'user1',
      to: 'user2',
      content: 'Hello World',
    })

    expect(msg.id).toBeDefined()
    expect(msg.from).toBe('user1')
    expect(msg.to).toBe('user2')
    expect(msg.content).toBe('Hello World')
    expect(msg.type).toBe('text')

    const allMessages = getMessages()
    const roomKey = ['user1', 'user2'].sort().join('-')
    expect(allMessages[roomKey]).toBeDefined()
    expect(allMessages[roomKey].length).toBe(1)
  })

  it('getHistory returns messages between two users', () => {
    addMessage({ from: 'user1', to: 'user2', content: 'Msg 1' })
    addMessage({ from: 'user2', to: 'user1', content: 'Msg 2' })
    addMessage({ from: 'user1', to: 'user3', content: 'Msg 3' })

    const history = getHistory('user1', 'user2')
    expect(history.length).toBe(2)
    expect(history[0].content).toBe('Msg 1')
    expect(history[1].content).toBe('Msg 2')
  })

  it('getHistory returns empty array for no messages', () => {
    const history = getHistory('user4', 'user5')
    expect(history).toEqual([])
  })

  it('addMessage caps messages at 200 per room', () => {
    for (let i = 0; i < 210; i++) {
      addMessage({ from: 'user1', to: 'user2', content: `Msg ${i}` })
    }

    const history = getHistory('user1', 'user2')
    expect(history.length).toBe(200)
    // Should keep only the last 200
    expect(history[0].content).toBe('Msg 10')
    expect(history[199].content).toBe('Msg 209')
  })

  it('room key is order-independent (both directions same room)', () => {
    addMessage({ from: 'alice', to: 'bob', content: 'A→B' })
    addMessage({ from: 'bob', to: 'alice', content: 'B→A' })

    const historyAB = getHistory('alice', 'bob')
    const historyBA = getHistory('bob', 'alice')

    expect(historyAB.length).toBe(2)
    expect(historyBA.length).toBe(2)
    expect(historyAB).toEqual(historyBA)
  })
})
