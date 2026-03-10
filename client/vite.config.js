import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        open: false,   // don't auto-open browser
        port: 3000,
    },
})
