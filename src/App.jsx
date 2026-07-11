import React from 'react'
import './index.css'
import './App.css'
import { ThemeProvider } from 'styled-components'
import theme from './theme'
import ChatApp from 'components/ChatApp'
import { HashRouter as Router } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { MessageProvider } from './context/MessageContext'
import { ToastProvider } from 'components/Toast'

function App () {
  return (
    <Router>
      <ToastProvider>
        <SocketProvider>
          <MessageProvider>
            <ThemeProvider theme={theme}>
              <ChatApp />
            </ThemeProvider>
          </MessageProvider>
        </SocketProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
