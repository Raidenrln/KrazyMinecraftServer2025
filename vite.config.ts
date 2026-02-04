import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
<<<<<<< HEAD
  plugins: [react(), tailwindcss()],
  base: '/KrazyMinecraft2025/' // <-- Must match your repo name exactly
})
=======
  base: '/KrazyMinecraftServer2025/',
  plugins: [react(), tailwindcss()]

})
>>>>>>> bf1c3f529fe991c4fa0ff275ccf572127882cf15
