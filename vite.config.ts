import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
      host: '127.0.0.1',
      https: {
          cert: './127.0.0.1.crt',
          key: './dvs.key'
      },
  },
  plugins: [react(), mkcert()],
})
