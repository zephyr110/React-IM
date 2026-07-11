import { createGlobalStyle } from 'styled-components'

const ToastGlobalStyle = createGlobalStyle`
  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`

export default ToastGlobalStyle
