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
import { updateTypeInFile, findInterfaceFileByUrl } from './typeGenerator'
import { printInfo } from './utils'

const _dirname =
  typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))

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
      isDev && createRequestTsServer(opt, config)
    },

    // 标准的Vite插件配置修改方式
    config(config) {
      // 如果没有配置 record，直接返回，不需要处理代理
      if (!opt.record) {
        return
      }

      // 确保基本配置存在
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}

      const prefix = opt?.prefix || '/api'
      const proxy = config.server.proxy as Record<string, any>

      // 处理已有的代理配置
      if (Object.keys(proxy).length > 0) {
        Object.keys(proxy).forEach((key) => {
          applyProxyConfig(proxy, key, prefix, opt)
        })
      }

      // 如果用户在插件选项中提供了代理配置，则合并它
      if (opt.proxy && typeof opt.proxy === 'object' && Object.keys(opt.proxy).length > 0) {
        Object.keys(opt.proxy).forEach((key) => {
          // 如果代理配置已存在，不覆盖它
          if (!proxy[key]) {
            proxy[key] = opt.proxy![key]
            // 为新加入的代理应用记录功能
            applyProxyConfig(proxy, key, prefix, opt)
          }
        })
      }

      return {
        server: {
          proxy,
        },
      }
    },

    configureServer: async (server) => {
      const { middlewares, printUrls } = server
      const { enable = isDev } = opt
      if (!enable) {
        return
      }
      middlewares.use(
        '/__mock',
        sirv(path.resolve(_dirname, '../client'), {
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

        // 写入类型定义的API端点
        if (req.url === '/write-type-definition' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: any) => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              const typeInfo = JSON.parse(body)
              const { url, typeDefinition, typeName } = typeInfo

              // 检查必要参数
              if (!url || !typeDefinition || !typeName) {
                throw new Error('缺少必要参数：url、typeDefinition 或 typeName')
              }

              // 检查请求路径配置
              if (!opt.requestPath) {
                throw new Error('未配置 requestPath，无法找到接口文件')
              }

              // 查找接口文件
              const matchingFiles = findInterfaceFileByUrl(url, opt.requestPath)

              if (matchingFiles.length === 0) {
                throw new Error(`未找到包含 URL ${url} 的接口文件`)
              }

              // 更新找到的所有匹配文件
              let updatedCount = 0
              for (const filePath of matchingFiles) {
                const updated = updateTypeInFile(filePath, url, typeDefinition, typeName)
                if (updated) {
                  updatedCount++
                }
              }

              if (updatedCount > 0) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.write(
                  JSON.stringify({
                    success: true,
                    message: `成功更新 ${updatedCount} 个文件的类型定义`,
                    updatedFiles: matchingFiles,
                  }),
                )
              } else {
                throw new Error('找到接口文件但更新类型失败')
              }
            } catch (error) {
              console.error('写入类型定义失败:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.write(
                JSON.stringify({
                  success: false,
                  message: `写入类型定义失败: ${error}`,
                }),
              )
            }
            res.end()
          })
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
      const _printUrls = printUrls
      server.printUrls = () => {
        _printUrls()
        printInfo({
          server: {
            port: config.server.port,
            host: config.server.host,
          },
        })
      }
      // const recordMiddleware = await recordRequestMiddleware(opt)
      // middlewares.use(recordMiddleware)
    },
  }
}

// 工具函数：为代理配置应用记录功能
function applyProxyConfig(
  proxy: Record<string, any>,
  key: string,
  prefix: string,
  opt: ViteMockOptions,
) {
  // 字符串形式的代理配置
  if (typeof proxy[key] === 'string') {
    proxy[key] = {
      configure: (proxy: any) =>
        serverProxyConfig({
          proxy,
          prefix,
          queryExclude: ['_'],
          record: opt?.record,
          recordExclude: opt?.recordExclude,
          logger: opt?.logger,
        }),
    }
  }
  // 对象形式的代理配置
  else if (proxy[key] && !(proxy[key] as ProxyOptions).configure) {
    const target = (proxy[key] as ProxyOptions).target as string
    if (typeof target === 'string') {
      proxy[key] = {
        ...(proxy[key] as ProxyOptions),
        configure: (proxy: any) =>
          serverProxyConfig({
            proxy,
            prefix,
            queryExclude: ['_'],
            record: opt?.record,
            recordExclude: opt?.recordExclude,
            logger: opt?.logger,
          }),
      }
    }
  }
}

export * from './types'
