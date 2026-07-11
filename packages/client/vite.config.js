import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    svgr(),
    react(),
  ],
  resolve: {
    alias: {
      'theme': path.resolve(__dirname, 'src/theme.js'),
      'components': path.resolve(__dirname, 'src/components'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'context': path.resolve(__dirname, 'src/context'),
      'data': path.resolve(__dirname, 'src/data'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
