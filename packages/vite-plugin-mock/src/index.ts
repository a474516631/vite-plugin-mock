;(async () => {
  try {
    await import('mockjs')
  } catch (e) {
    throw new Error('vite-plugin-vue-mock requires mockjs to be present in the dependency tree.')
  }
})()
import url from 'url'
import type { ViteMockOptions } from './types'
import type { Plugin, ProxyOptions } from 'vite'
import { ResolvedConfig } from 'vite'
import { createMockServer, mockData, requestMiddleware } from './createMockServer'
import sirv from 'sirv'
import path from 'path'
import { serverProxyConfig } from './serverProxyConfig'
import { createRequestTsServer, requestTsData } from './createTsTypeServer'
import { getMockData } from './suggestionGpt'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname =
  typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))

export function viteMockServe(opt: ViteMockOptions = {}): Plugin {
  let isDev = false
  let config: ResolvedConfig

  return {
    name: 'vite:mock',
    enforce: 'pre' as const,

    config(config, env) {
      if (config.server && config.server.proxy) {
        const { proxy } = config.server
        const prefix = opt?.prefix || '/api'
        if (opt.record) {
          Object.keys(proxy).forEach((key) => {
            if (typeof proxy[key] === 'string') {
              proxy[key] = {
                configure: (proxy) =>
                  serverProxyConfig({
                    proxy,
                    prefix: prefix,
                    queryExclude: ['_'],
                    record: opt?.record,
                    recordExclude: opt?.recordExclude,
                    logger: opt?.logger,
                  }),
              }
            }
            if (!(proxy[key] as ProxyOptions).configure) {
              const target = (proxy[key] as ProxyOptions).target as string
              if (typeof target === 'string') {
                proxy[key] = {
                  ...(proxy[key] as ProxyOptions),
                  configure: (proxy) =>
                    serverProxyConfig({
                      proxy,
                      prefix: prefix,
                      queryExclude: ['_'],
                      record: opt?.record,
                      recordExclude: opt?.recordExclude,
                      logger: opt?.logger,
                    }),
                }
              }
            }
          })
        }
      }
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig
      isDev = config.command === 'serve'
      isDev && createMockServer(opt, config)
      isDev && createRequestTsServer(opt, config)
    },

    configureServer: async ({ middlewares }) => {
      const { enable = isDev } = opt
      if (!enable) {
        return
      }
      middlewares.use(
        '/__mock',
        sirv(path.resolve(_dirname, '../dist/client'), {
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
        if (req.url === '/type-api') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          // 这里需要获取request的类型
          res.write(JSON.stringify(requestTsData))
          res.end()
          return
        }
        console.log(req.url)
        if (req.url.startsWith('/ai-mock')) {
          let queryParams: {
            query?: {
              [key: string]: any
            }
            pathname?: string | null
          } = {}

          if (req.url) {
            queryParams = url.parse(req.url, true)
          }
          const reqUrlParams = queryParams
          console.log(reqUrlParams)
          if (!queryParams.query?.url) {
            return
          }
          const resType = requestTsData[queryParams.query.url]?.resType
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          if (opt.openAIApiKey) {
            res.write(
              await getMockData(resType, {
                openAIApiKey: opt.openAIApiKey,
                modelName: opt.modelName || 'gpt-3.5-turbo',
              }),
            )
          } else {
            res.write(
              JSON.stringify({
                error: '请配置open AI的key',
              }),
            )
          }
          res.end()
          return
        }

        next()
      })

      const middleware = await requestMiddleware(opt)
      middlewares.use(middleware)
      // const recordMiddleware = await recordRequestMiddleware(opt)
      // middlewares.use(recordMiddleware)
    },
  }
}

export * from './types'
