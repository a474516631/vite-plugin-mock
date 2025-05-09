import { viteMockServe } from 'vite-plugin-ai-mock'

import { UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
const target = 'https://assistantdesk.zuoyebang.cc/'

export default (): UserConfigExport => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
        logger: true,
        requestPath: 'src/request',
        scene: 'dev',
      }) as any,
    ],
    server: {
      port: 3333,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
}
