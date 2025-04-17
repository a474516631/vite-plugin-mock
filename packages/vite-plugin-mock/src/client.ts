/* eslint-disable */
import type { MockMethod } from './types'

// 声明变量以解决浏览器 API 的类型问题
declare const window: any
declare const URL: any
declare const Headers: any
declare const Response: any
declare const fetch: any

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
export async function createProdMockServer(mockList: any[], options = { debug: false }) {
  const Mock = (await import('mockjs')).default
  const { pathToRegexp } = await import('path-to-regexp')

  // 确保在浏览器环境中运行
  if (typeof window === 'undefined') {
    console.warn('createProdMockServer 应该在浏览器环境中运行')
    return
  }

  // 添加全局开关
  window.__MOCK_ENABLED__ = true
  window.__MOCK_DEBUG__ = options.debug
  window.__mockList__ = mockList // 保存 mockList 引用以便验证函数使用

  // 提供控制方法
  window.__MOCK_CONTROL__ = {
    enable: () => {
      window.__MOCK_ENABLED__ = true
    },
    disable: () => {
      window.__MOCK_ENABLED__ = false
    },
    status: () => {
      console.log(`Mock 状态: ${window.__MOCK_ENABLED__ ? '启用' : '禁用'}`)
      console.log(`已配置的接口: ${mockList.length}个`)
      console.table(
        mockList.map((item) => ({
          url: item.url,
          method: item.method || 'GET',
        })),
      )
    },
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
    if (!window.__MOCK_ENABLED__) {
      return originalFetch(input, init)
    }

    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const method = (init?.method || 'get').toLowerCase()

    // 添加请求日志
    console.log(`[Mock] 拦截请求: ${method.toUpperCase()} ${url}`)

    // 查找匹配的 mock 配置
    const matchedItem = mockList.find((item) => {
      const mockUrl = item.url
      const mockMethod = (item.method || 'get').toLowerCase()

      try {
        const regex = pathToRegexp(mockUrl, undefined, { end: false })
        const isMatch = regex.test(url) && mockMethod === method

        // 记录匹配结果
        if (isMatch) {
          console.log(`[Mock] ✅ 匹配成功: ${mockUrl}`)
        }
        return isMatch
      } catch (e) {
        return false
      }
    })

    if (!matchedItem) {
      console.log(`[Mock] ❌ 未匹配到配置，使用原始请求`)
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

    // 记录返回的 mock 数据
    let responseData
    if (typeof matchedItem.response === 'function') {
      responseData = matchedItem.response(reqConfig)
      console.log(`[Mock] 📦 返回函数生成的数据:`, responseData)
    } else {
      responseData = matchedItem.response
      console.log(`[Mock] 📦 返回静态数据:`, responseData)
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
    return new Response(
      JSON.stringify({
        ...responseData,
        __mocked__: true,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Mocked': 'true',
        },
        status: matchedItem.statusCode || 200,
      },
    )
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

/**
 * 验证 Mock 拦截器是否正常工作
 * 通过创建临时测试端点并发送请求来验证 Mock 拦截是否成功
 * @returns Promise<boolean> Mock 拦截是否正常工作
 */
export async function verifyMockSetup() {
  // 创建一个特殊的测试端点
  const testEndpoint = '/__mock_verify__'
  const testResponse = { verified: true, timestamp: Date.now() }

  if (!window.__mockList__) {
    console.error('[Mock] 验证失败: window.__mockList__ 未定义')
    return false
  }

  // 添加一个临时的 mock 规则
  window.__mockList__.push({
    url: testEndpoint,
    method: 'get',
    response: testResponse,
  })

  try {
    // 发送验证请求
    const response = await window.fetch(testEndpoint)
    const data = await response.json()

    // 验证响应与预期是否匹配
    const isVerified = data.verified === true

    console.log(`[Mock] 验证${isVerified ? '成功' : '失败'}!`)
    console.log(`[Mock] ${isVerified ? '✅ Mock 拦截器工作正常' : '❌ Mock 拦截器未正确工作'}`)

    return isVerified
  } catch (error) {
    console.error('[Mock] 验证过程出错:', error)
    return false
  } finally {
    // 移除临时测试规则
    const index = window.__mockList__.findIndex((item: any) => item.url === testEndpoint)
    if (index !== -1) {
      window.__mockList__.splice(index, 1)
    }
  }
}
