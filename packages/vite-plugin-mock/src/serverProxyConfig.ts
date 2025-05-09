import type { IncomingMessage } from 'node:http'
import type { Recordable } from './types'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { type HttpProxy } from 'vite'

import { createFileWithDir, getMockPath, loggerOutput, resolveUrlPathnameSearch } from './utils'
import { mockTsStrTemplate } from './template'

export interface IUrlsFileData {
  target: string
  prefix: string
  urls: Urls
  queryExclude: string[]
}

export interface Urls {
  get: string[]
  post: string[]
}

export interface ResponseReqParams {
  url: string
  body: Recordable
  query: Recordable
  headers: Recordable
}

/** serve mock extra config */
export interface ServeMockExtra {
  /** http-proxy */
  proxy: HttpProxy.Server
  /** 是否开启 录制模式 */
  record?: boolean
  /** target */
  // target: string
  /** prefix */
  prefix: string

  /** 录制排除 */
  recordExclude?: string | string[]
  /** query参数排除 */
  queryExclude?: string[]
  /** 是否开启logger */
  logger?: boolean
}

enum HTTPMethod {
  GET = 'get',
  POST = 'post',
}

/**
 * http-proxy
 * VITE_MOCK_MODE 为 RECORD 时替换vite中的server/proxy/configure
 */
export function serverProxyConfig(params: ServeMockExtra) {
  return new ServerMockProxy({ ...params })
}

class ServerMockProxy {
  prefix: string
  recordExclude?: string | string[]
  queryExclude?: string[]
  logger?: boolean = true
  constructor(params: ServeMockExtra) {
    const { proxy, prefix, recordExclude, queryExclude, logger } = params
    this.prefix = prefix
    this.recordExclude = recordExclude
    this.queryExclude = queryExclude
    this.logger = logger
    proxy.on('proxyRes', (proxyRes, req) => this.onProxyResHandler(proxyRes, req))
  }

  /** 处理代理指定环境的接口响应数据并写入本地mock文件 */
  onProxyResHandler(proxyRes: IncomingMessage, req: IncomingMessage) {
    const contentEncode = proxyRes.headers['content-encoding']
    let body = ''
    if (!contentEncode) {
      proxyRes
        .on('data', (chunk) => (body += chunk))
        .on('end', () => {
          if (body) {
            this.writeMockData(req, body)
          }
        })
    }
    if (contentEncode === 'gzip') {
      const gunzip = zlib.createGunzip()
      proxyRes
        .pipe(gunzip)
        .on('data', (chunk) => (body += chunk))
        .on('end', () => {
          if (body) {
            this.writeMockData(req, body)
          }
        })
    }
    if (contentEncode === 'br') {
      const brotli = zlib.createBrotliDecompress()
      proxyRes
        .pipe(brotli)
        .on('data', (chunk) => (body += chunk))
        .on('end', () => {
          if (body) {
            this.writeMockData(req, body)
          }
        })
    }
    if (Number(proxyRes.statusCode) === 302) {
      // 后端没有接口时，自动生成一个空的文件json
      this.writeMockData(
        req,
        JSON.stringify({
          errNo: 0,
          errMsg: 'success',
          errStr: 'success',
          data: {},
        }),
      )
    }
  }

  /** 写入mock数据 */
  writeMockData(req: IncomingMessage, body: string) {
    const url = req.url!

    const { pathname } = resolveUrlPathnameSearch(url, this.queryExclude)
    const mockPath = getMockPath(pathname!, this.prefix)
    if (this.recordExclude) {
      const recordExclude: string[] =
        typeof this.recordExclude === 'string' ? [this.recordExclude] : this.recordExclude
      if (recordExclude.some((re) => pathname!.includes(re!))) {
        return console.warn(`⛔ skip record: ${pathname}`)
      }
    }
    if (!fs.existsSync(mockPath)) {
      fs.mkdirSync(mockPath, { recursive: true })
    }
    try {
      // 生成2个文件  1个文件为ts 1个文件为json

      const jsonPath = path.join(mockPath, 'data/index.json')
      const tsPath = path.join(mockPath, 'index.ts')

      let parsedBody: any
      try {
        parsedBody = JSON.parse(body || '{}')
      } catch (e: any) {
        parsedBody = new URLSearchParams(body)
        parsedBody = Object.fromEntries(parsedBody.entries())
      }
      if (!fs.existsSync(tsPath)) {
        createFileWithDir(
          tsPath,
          mockTsStrTemplate({
            reqUrl: pathname!,
            reqMethod: req.method!.toLowerCase() as HTTPMethod,
            prefix: this.prefix,
          }),
        )
        this.logger &&
          loggerOutput(`🚀 录制成功 生成 mock ts文件: `, `${pathname}, mock文件地址：${tsPath}`)
      }
      if (!fs.existsSync(jsonPath)) {
        createFileWithDir(jsonPath, JSON.stringify(parsedBody, null, 2))
        this.logger &&
          loggerOutput(`🚀 录制成功.写入 json 文件 : `, `${pathname}, mock文件地址：${jsonPath}`)
      }
    } catch (e) {
      console.error('writeMockDataError', e)
    }
  }
}
