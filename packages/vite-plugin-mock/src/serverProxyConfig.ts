import type { IncomingMessage } from 'node:http'
import type { MockMethod, Recordable } from './types'
import fs, { write } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import zlib from 'node:zlib'
import { type HttpProxy, loadEnv } from 'vite'

import {
  createFileWithDir,
  generateShortHash,
  getMockPath,
  getReqMockBodyHash,
  loggerOutput,
  resolveQueryFileName,
  resolveUrlPathnameSearch,
  setReqMockBodyHash,
} from './utils'
import { mockTsStrTemplate } from './template'

export interface IUrlsFileData {
  target: string
  prefix: string
  urls: Urls
  scene: string
  queryExclude: string[]
}

export interface Urls {
  get: string[]
  post: string[]
}

function getUrls(): Array<IUrlsFileData> {
  const Urls = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'mockServer/urls.json')).toString(),
  )
  return Urls
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
  target: string
  /** prefix */
  prefix: string
  /** 当前场景 */
  scene?: string
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

export function genAllMocks() {
  const Urls = getUrls()
  return Urls.flatMap(({ prefix, target, urls, scene, queryExclude }) => {
    const gets = urls.get.map((url) =>
      genMock(url, HTTPMethod.GET, target, prefix, scene, queryExclude),
    )
    const posts = urls.post.map((url) =>
      genMock(url, HTTPMethod.POST, target, prefix, scene, queryExclude),
    )
    return gets.concat(posts)
  })
}

/** mock插件response handler */
export function mockResHandler(
  req: ResponseReqParams,
  target: string,
  prefix: string,
  scene?: string,
  queryExclude?: string[],
) {
  const bodyStr = JSON.stringify(req.body)
  if (req.url) {
    const { pathname, search } = resolveUrlPathnameSearch(req.url, queryExclude)
    const dir = getMockPath(pathname!, target, prefix, scene)

    const queryName = resolveQueryFileName(
      search,
      bodyStr !== '{}' ? generateShortHash(bodyStr) : undefined,
    )
    const filePath = path.join(dir, queryName)
    // consola.success('🚀 resolve mock path', green(filePath))
    try {
      if (fs.existsSync(filePath)) {
        const result = fs.readFileSync(filePath).toString()
        return JSON.parse(result).resBody
      } else {
        // consola.warn('🚀 resolve mock path not exists', red(filePath))
      }
    } catch (error) {
      console.error(error)
      return {}
    }
  }
}

/** 构造MockMethod */
function genMock(
  url: string,
  method: HTTPMethod,
  target: string,
  prefix: string,
  scene?: string,
  queryExclude?: string[],
): MockMethod {
  return {
    url: `${prefix}${url}`,
    method,
    response: (req: ResponseReqParams) => mockResHandler(req, target, prefix, scene, queryExclude),
  }
}

/**
 * http-proxy
 * VITE_MOCK_MODE 为 RECORD 时替换vite中的server/proxy/configure
 */
export function serverProxyConfig(params: ServeMockExtra) {
  // const { target, prefix, scene, recordExclude, queryExclude } = params
  return new ServerMockProxy({ ...params })
}

class ServerMockProxy {
  target: string
  prefix: string
  scene?: string = ''
  recordExclude?: string | string[]
  queryExclude?: string[]
  logger?: boolean = true
  constructor(params: ServeMockExtra) {
    const { proxy, target, prefix, scene, recordExclude, queryExclude, logger } = params
    this.target = target
    this.prefix = prefix
    this.scene = scene ?? ''
    this.recordExclude = recordExclude
    this.queryExclude = queryExclude
    this.logger = logger
    proxy
      // .on('start', proxyReq => this.onProxyStartHandler(proxyReq))
      .on('proxyRes', (proxyRes, req) => this.onProxyResHandler(proxyRes, req))
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

    const { pathname, search } = resolveUrlPathnameSearch(url, this.queryExclude)
    const mockPath = getMockPath(pathname!, this.target, this.prefix, this.scene)
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
      }
      if (!fs.existsSync(jsonPath)) createFileWithDir(jsonPath, JSON.stringify(parsedBody, null, 2))
      this.logger && loggerOutput(`🚀 录制成功 : `, `${pathname}, mock文件地址：${tsPath}`)
    } catch (e) {
      console.error('writeMockDataError', e)
    }
  }
}
