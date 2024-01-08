import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist', // Thư mục đầu ra build
    assetsDir: 'assets', // Thư mục chứa tài nguyên (hình ảnh, font chữ, ...)
    minify: 'terser', // Minify bằng Terser (có thể thay đổi thành 'esbuild' nếu bạn muốn sử dụng esbuild)
    sourcemap: true, // Tạo source map
    rollupOptions: {
      // Cấu hình cho Rollup
      external: ['vue'] // Bạn có thể thêm các dependencies bạn muốn giữ ngoại trừ ở đây
    }
  }
})
