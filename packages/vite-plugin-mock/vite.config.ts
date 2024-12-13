import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
// import { alias } from '../../alias'
import UnoCSS from 'unocss/vite'
// import LarkInspector from './src/index'
import UnIcon from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/__mock/' : '/',
  plugins: [
    UnoCSS(),

    Vue(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
      logger: true,
      requestPath: './client/request',
    }),
    Components({
      resolvers: [IconsResolver()],
      dirs: './client/components',
      dts: './client/components.d.ts',
    }),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: './client/auto-imports.d.ts',
    }),
    Pages({
      dirs: './client/pages',
    }),
    UnIcon({
      compiler: 'vue3',
      autoInstall: true,
    }),
  ],
  build: {
    outDir: './dist/client',
  },
  server: {
    port: 3000,
  },
}))
