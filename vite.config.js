import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from 'tailwindcss' // --- IGNORE ---

// ✅ Correct version — no tailwindcss() here
export default defineConfig({
  plugins: [react()],
})
