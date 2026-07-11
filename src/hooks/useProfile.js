import { useState, useCallback } from 'react'

const STORAGE_KEY = 'react-im-profile'

const defaultProfile = {
  name: '',
  gender: '男',
  region: '北京市 海淀区',
  signature: '前端小白，努力让自己在前端的路上走更远一些 ✊ 💪 💯',
  phone: '+86 18612345667',
  email: 'admin@gmail.com',
  website: 'https://www.baidu.com',
  weibo: '',
  github: '',
  linkedin: '',
}

function loadProfile () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultProfile, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...defaultProfile }
}

export default function useProfile () {
  const [profile, setProfile] = useState(loadProfile)

  const updateProfile = useCallback((fields) => {
    setProfile(prev => {
      const next = { ...prev, ...fields }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { profile, updateProfile }
}
