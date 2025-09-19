import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':"https://bhagavad-gita-chat-bot-2.onrender.com"
    }
  },
  plugins: [react()],
})
