import { useState, useCallback } from 'react'

const STORAGE_KEY = 'echo-blocked'

function loadBlocked () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function useBlockedList () {
  const [blockedIds, setBlockedIds] = useState(loadBlocked)

  const blockContact = useCallback((contactId) => {
    setBlockedIds(prev => {
      if (prev.includes(contactId)) return prev
      const next = [...prev, contactId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const unblockContact = useCallback((contactId) => {
    setBlockedIds(prev => {
      const next = prev.filter(id => id !== contactId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isBlocked = useCallback((contactId) => blockedIds.includes(contactId), [blockedIds])

  return { blockedIds, blockContact, unblockContact, isBlocked }
}
