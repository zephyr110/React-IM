import { useState, useCallback, useRef } from 'react'

export default function useDrafts () {
  const draftsRef = useRef(new Map())
  const [, forceUpdate] = useState(0)

  const saveDraft = useCallback((contactId, text) => {
    draftsRef.current.set(contactId, text)
  }, [])

  const getDraft = useCallback((contactId) => {
    return draftsRef.current.get(contactId) || ''
  }, [])

  const clearDraft = useCallback((contactId) => {
    draftsRef.current.delete(contactId)
    forceUpdate(n => n + 1)
  }, [])

  return { saveDraft, getDraft, clearDraft }
}
