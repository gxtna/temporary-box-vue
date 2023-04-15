import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import * as path from 'path'
export default defineConfig({
  plugins: [vue()],
  resolve: {
    //设置别名
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})
