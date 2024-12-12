import fs from 'fs'
import type { IncomingMessage } from 'node:http'
import type { Recordable } from './types'
import crypto from 'node:crypto'
import path from 'node:path'
import { URL } from 'node:url'
import { zybAbsMockPath } from './createMockServer'
import colors from 'picocolors'

const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

// eslint-disable-next-line
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, 'Function') || is(val, 'AsyncFunction')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

export function isAbsPath(path: string | undefined) {
  if (!path) {
    return false
  }
  // Windows 路径格式：C:\ 或 \\ 开头，或已含盘符（D:\path\to\file）
  if (/^([a-zA-Z]:\\|\\\\|(?:\/|\uFF0F){2,})/.test(path)) {
    return true
  }
  // Unix/Linux 路径格式：/ 开头
  return /^\/[^/]/.test(path)
}

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, time)
  })
}
export function createFileWithDir(filePath: string, content = '') {
  // 获取文件所在目录路径
  const dirPath = path.dirname(filePath)

  // 判断目录是否存在，不存在则创建
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // 创建文件，如果文件已存在则会覆盖原有文件内容（可根据需求调整）
  fs.writeFileSync(filePath, content, { flag: 'w' })
}

export function loggerOutput(title: string, msg: string, type: 'info' | 'error' = 'info') {
  const tag = type === 'info' ? colors.cyan(`[vite:mock]`) : colors.red(`[vite:mock-server]`)
  return console.log(
    `${colors.dim(new Date().toLocaleTimeString())} ${tag} ${colors.green(title)} ${colors.dim(
      msg,
    )}`,
  )
}

const MockBodyHashKey = 'mock-body-hash'

export function generateShortHash(str: string) {
  const hash = crypto.createHash('md5').update(str).digest('hex')
  return hash.slice(0, 8)
}

/** 获取请求体 md5 hash */
export function getReqMockBodyHash(req: IncomingMessage) {
  return req.headers[MockBodyHashKey] as string | undefined
}

/** 设置请求体 md5 hash */
export function setReqMockBodyHash(req: IncomingMessage, hash: string) {
  req.headers[MockBodyHashKey] = hash
}

/** 根据请求body的hash和请求query确定文件名 */
export function resolveQueryFileName(search: string | null, hash?: string) {
  return `${hash ? `MBH=${hash}&` : ''}${search ? decodeURIComponent(search) : 'index'}.json`
}

/** 获取mock数据的path */
export function getMockPath(pathname: string, target: string, prefix: string, scene?: string) {
  const { hostname, pathname: pathName } = new URL(target)
  const proxyTarget = `${hostname}${pathName}`.replaceAll('/', '_')
  return path.join(zybAbsMockPath, scene ?? 'default', proxyTarget, pathname.replace(prefix, ''))
}

export interface RequestParams {
  mathod: string
  body: any
  query: any
}

export function resOk<T = Recordable>(data: T, extra?: { errStr?: string; errMsg?: string }) {
  return {
    errNo: 200,
    errStr: extra?.errStr ?? 'succ',
    errMsg: extra?.errMsg ?? 'succ',
    data,
  }
}

export function resErr(data: Recordable, extra?: { errStr?: string; errMsg?: string }) {
  return {
    errNo: 400,
    errStr: extra?.errStr ?? '参数错误',
    errMsg: extra?.errMsg ?? '参数错误',
    data: data ?? null,
  }
}

export function resPageOk<T>(
  list: T[],
  extra: { pn: number; rn: number; errStr?: string; errMsg?: string },
) {
  return {
    errNo: 200,
    errStr: extra.errStr ?? 'succ',
    errMsg: extra.errMsg ?? 'succ',
    data: {
      total: list.length,
      list: pagination(list, extra.pn, extra.rn),
    },
  }
}

export function pagination<T>(arr: T[], pn: number, rn: number): T[] {
  const offset = (pn - 1) * Number(rn)
  return offset + Number(rn) >= arr.length
    ? arr.slice(offset, arr.length)
    : arr.slice(offset, offset + Number(rn))
}

export function resolveUrlPathnameSearch(url: string, queryExclude?: string[]) {
  // eslint-disable-next-line prefer-const
  let { pathname, search } = new URL(url.replace('//', '/'), 'http://localhost:5173')
  if ((queryExclude?.length ?? 0) > 0) {
    const usp = new URLSearchParams(search)
    queryExclude?.forEach((query) => {
      if (usp.has(query)) {
        usp.delete(query)
      }
    })
    search = usp.toString()
  }
  search = search.replace('?', '')
  return { pathname, search }
}
