import React from 'react'
import   './index.css'
import './App.css';
import { ThemeProvider } from 'styled-components';
import theme from 'theme'
import ChatApp from 'components/ChatApp';
// import { BrowserRouter as Router } from 'react-router-dom'
import { HashRouter as Router } from 'react-router-dom'

function App () {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <ChatApp />
      </ThemeProvider>
    </Router>
  )
}

export default App;
