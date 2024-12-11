;(async () => {
  try {
    await import('mockjs')
  } catch (e) {
    throw new Error('vite-plugin-vue-mock requires mockjs to be present in the dependency tree.')
  }
})()

import type { ViteMockOptions } from './types'
import type { Plugin } from 'vite'
import { ResolvedConfig } from 'vite'
import { createMockServer, matchMockRequest, mockData, requestMiddleware } from './createMockServer'
import sirv from 'sirv'
import path from 'path'

export function viteMockServe(opt: ViteMockOptions = {}): Plugin {
  let isDev = false
  let config: ResolvedConfig

  return {
    name: 'vite:mock',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      config = resolvedConfig
      isDev = config.command === 'serve'
      isDev && createMockServer(opt, config)
    },

    configureServer: async ({ middlewares }) => {
      const { enable = isDev } = opt
      if (!enable) {
        return
      }

      middlewares.use(
        '/__mock',
        sirv(path.resolve(__dirname, '../dist/client'), {
          single: true,
          dev: true,
        }),
      )
      middlewares.use('/__mock_api', async (req: any, res: any, next: any) => {
        if (!req.url) return next()
        if (req.url === '/') {
          // await ctx.ready

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.write(JSON.stringify(mockData))
          res.end()
          return
        }

        if (req.url.startsWith('/api')) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          // 这里需要获取request的类型
          res.write(JSON.stringify(mockData))
          res.end()
        }
        next()
      })

      const middleware = await requestMiddleware(opt)
      middlewares.use(middleware)
    },
  }
}

export * from './types'
