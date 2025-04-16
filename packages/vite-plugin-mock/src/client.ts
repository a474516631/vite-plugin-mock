/* eslint-disable */
import type { MockMethod } from './types'

// 声明变量以解决浏览器 API 的类型问题
declare const window: any
declare const URL: any
declare const Headers: any
declare const Response: any

/**
 * 创建生产环境模拟服务器
 * 该函数拦截 XMLHttpRequest 和 fetch API 请求，根据 mockList 提供的配置返回模拟数据
 * 从 3.0.3-beta.11 版本开始，支持 fetch API 和 XMLHttpRequest
 *
 * @param mockList 模拟数据配置列表
 * @example
 * ```ts
 * import { createProdMockServer } from 'vite-plugin-ai-mock/client'
 * import userMock from './mock/user'
 *
 * createProdMockServer([...userMock])
 * ```
 */
export async function createProdMockServer(mockList: any[]) {
  const Mock: any = await import('mockjs')
  const { pathToRegexp } = await import('path-to-regexp')

  // 确保在浏览器环境中运行
  if (typeof window === 'undefined') {
    console.warn('createProdMockServer 应该在浏览器环境中运行')
    return
  }

  // 保存原始的 XMLHttpRequest 和 fetch
  const originalFetch = window.fetch

  // 设置 XHR 拦截
  setupXHRMock(Mock, pathToRegexp, mockList)

  // 设置 fetch 拦截
  setupFetchMock(Mock, pathToRegexp, mockList, originalFetch)
}

function setupXHRMock(Mock: any, pathToRegexp: any, mockList: any[]) {
  Mock.XHR.prototype.__send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    if (this.custom.requestHeaders) {
      const headers: any = {}
      for (let k in this.custom.requestHeaders) {
        headers[k.toString().toLowerCase()] = this.custom.requestHeaders[k]
      }
      this.custom.options = Object.assign({}, this.custom.options, { headers })
    }
    this.__send.apply(this, arguments)
  }

  Mock.XHR.prototype.proxy_open = Mock.XHR.prototype.open

  Mock.XHR.prototype.open = function () {
    let responseType = this.responseType
    this.proxy_open(...arguments)
    if (this.custom.xhr) {
      if (responseType) {
        this.custom.xhr.responseType = responseType
      }
    }
  }

  for (const { url, method, response, timeout } of mockList) {
    __setupMock__(Mock, timeout)
    Mock.mock(
      pathToRegexp(url, undefined, { end: false }),
      method || 'get',
      __XHR2ExpressReqWrapper__(Mock, response),
    )
  }
}

function setupFetchMock(Mock: any, pathToRegexp: any, mockList: any[], originalFetch: any) {
  // 替换全局 fetch
  window.fetch = async function (input: any, init?: any): Promise<any> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const method = (init?.method || 'get').toLowerCase()

    // 查找匹配的 mock 配置
    const matchedItem = mockList.find((item) => {
      const mockUrl = item.url
      const mockMethod = (item.method || 'get').toLowerCase()

      try {
        const regex = pathToRegexp(mockUrl, undefined, { end: false })
        return regex.test(url) && mockMethod === method
      } catch (e) {
        return false
      }
    })

    if (!matchedItem) {
      // 没有匹配的 mock 配置，调用原始 fetch
      return originalFetch(input, init)
    }

    // 解析请求信息
    let body: any = undefined
    if (init?.body) {
      try {
        body = JSON.parse(init.body.toString())
      } catch (e) {
        // 非 JSON 格式的 body，保持原样
        body = init.body
      }
    }

    // 构建请求配置
    const reqConfig = {
      method,
      body,
      query: __param2Obj__(url),
      headers: init?.headers || {},
      url: url,
    }

    // 处理响应
    let responseData
    if (typeof matchedItem.response === 'function') {
      responseData = matchedItem.response(reqConfig)
    } else {
      responseData = matchedItem.response
    }

    // 应用 Mock.js 处理
    responseData = Mock.mock(responseData)

    // 模拟延迟
    if (matchedItem.timeout) {
      await new Promise((resolve) => setTimeout(resolve, matchedItem.timeout))
    }

    // 如果配置了 rawResponse，则使用自定义响应
    if (matchedItem.rawResponse) {
      // 创建一个模拟的 Response 对象
      const mockRes = {
        status: 200,
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: null,
        statusText: 'OK',
        ok: true,
        type: 'basic',
        redirected: false,
        url: url,
        bodyUsed: false,
      }

      // 用于保存 rawResponse 写入的数据
      let responseBody = ''

      // 模拟 res.write 和 res.end
      const mockServerResponse = {
        setHeader: (name: string, value: string) => {
          mockRes.headers.set(name, value)
        },
        statusCode: 200,
        write: (chunk: string) => {
          responseBody += chunk
        },
        end: (chunk?: string) => {
          if (chunk) responseBody += chunk
        },
      }

      // 调用自定义 rawResponse
      await matchedItem.rawResponse(
        {
          method,
          body,
          query: reqConfig.query,
          headers: reqConfig.headers,
        },
        mockServerResponse,
      )

      // 根据收集到的数据构建 Response
      return new Response(responseBody, {
        status: mockServerResponse.statusCode,
        headers: mockRes.headers,
        statusText: mockServerResponse.statusCode === 200 ? 'OK' : 'Error',
      })
    }

    // 构建标准 Response
    return new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: matchedItem.statusCode || 200,
    })
  }
}

function __param2Obj__(url: string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}',
  )
}

function __XHR2ExpressReqWrapper__(_Mock: any, handle: (d: any) => any) {
  return function (options: any) {
    let result = null
    if (typeof handle === 'function') {
      const { body, type, url, headers } = options

      let b = body
      try {
        b = JSON.parse(body)
      } catch {}
      result = handle({
        method: type,
        body: b,
        query: __param2Obj__(url),
        headers,
      })
    } else {
      result = handle
    }

    return _Mock.mock(result)
  }
}

function __setupMock__(mock: any, timeout = 0) {
  timeout &&
    mock.setup({
      timeout,
    })
}

/**
 * 定义模拟模块的辅助函数
 * 用于简化模拟模块的定义，支持基于环境配置的动态模拟数据
 *
 * @param fn 根据环境配置返回模拟数据的函数
 * @example
 * ```ts
 * export default defineMockModule(({ mode }) => {
 *   return [
 *     {
 *       url: '/api/users',
 *       method: 'get',
 *       response: mode === 'development'
 *         ? developmentData
 *         : productionData
 *     }
 *   ]
 * })
 * ```
 */
export function defineMockModule(
  fn: (config: {
    env: Record<string, any>
    mode: string
    command: 'build' | 'serve'
  }) => Promise<MockMethod[]> | MockMethod[],
) {
  return fn
}

// 重新导出 MockMethod 类型以便用户不必从主包导入
export type { MockMethod }
