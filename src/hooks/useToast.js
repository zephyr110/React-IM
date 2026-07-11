import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider ({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const typeColors = {
    info: '#4f9dde',
    success: '#34d859',
    warning: '#f0ad4e',
    error: '#f34848',
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && React.createElement('div', {
        style: {
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          display: 'flex', flexDirection: 'column', gap: 8,
        }
      },
        toasts.map(t => React.createElement('div', {
          key: t.id,
          onClick: () => removeToast(t.id),
          style: {
            background: typeColors[t.type] || typeColors.info,
            color: '#fff', padding: '10px 20px', borderRadius: 8,
            fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,.2)',
            animation: 'slideIn 0.3s ease',
            maxWidth: 320, wordBreak: 'break-word',
          }
        }, t.message))
      )}
    </ToastContext.Provider>
  )
}

export function useToast () {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
