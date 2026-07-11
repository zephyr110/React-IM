import React from 'react'
import ToastGlobalStyle from './style'

function ToastStyleWrapper ({ children }) {
  return (
    <>
      <ToastGlobalStyle />
      {children}
    </>
  )
}

export { ToastProvider, useToast } from 'hooks/useToast'
export { default as ToastStyle } from './style'
