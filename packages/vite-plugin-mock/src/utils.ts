import fs from 'fs'
import path from 'path'

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

  console.log(`文件 ${filePath} 创建成功`)
}
