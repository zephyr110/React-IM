import { useState, useCallback } from 'react'

const STORAGE_KEY = 'react-im-settings'

const defaultSettings = {
  newMessageNotification: true,
  voiceVideoAlert: true,
  showNotificationDetail: true,
  sound: true,
  friendVerification: true,
  recommendContacts: true,
  findByPhone: false,
}

function loadSettings () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...defaultSettings }
}

export default function useSettings () {
  const [settings, setSettings] = useState(loadSettings)

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { settings, updateSetting }
}
