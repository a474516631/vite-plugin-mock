import 'web-streams-polyfill/polyfill'
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
import { viteMockServe } from 'vite-plugin-ai-mock'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/__mock/' : '/',
  plugins: [
    wasm(),
    UnoCSS(),
    topLevelAwait(),
    Vue(),
    command !== 'build'
      ? viteMockServe({
          mockPath: 'mock',
          enable: true,
          logger: true,
          record: true,
          requestPath: './client/request',
          openAIApiKey: 'zyb-00c0f94aaf2fc96765e16e29aeede775@zbk_edu_aigc',
          modelName: 'gpt-3.5-turbo-1106',
          scene: 'production',
        })
      : [],
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
