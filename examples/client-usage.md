# 使用 vite-plugin-ai-mock/client 模块示例

本示例演示如何在生产环境中使用 `vite-plugin-ai-mock/client` 模块设置模拟服务。

## 步骤 1: 创建模拟数据

首先，创建你的模拟数据文件：

```typescript
// mock/user.ts
import { MockMethod } from 'vite-plugin-ai-mock/client'

export default [
  {
    url: '/api/users',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: [
          { id: 1, name: '张三', age: 25 },
          { id: 2, name: '李四', age: 30 },
        ],
        message: '获取成功',
      }
    },
  },
  {
    url: '/api/users/:id',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      return {
        code: 0,
        data: { id, name: id === '1' ? '张三' : '李四', age: id === '1' ? 25 : 30 },
        message: '获取成功',
      }
    },
  },
] as MockMethod[]
```

## 步骤 2: 创建 mockProdServer

创建一个文件来设置生产环境的模拟服务：

```typescript
// mockProdServer.ts
import { createProdMockServer } from 'vite-plugin-ai-mock/client'
import userMock from './mock/user'

// 可以使用动态导入
// const modules = import.meta.glob('./mock/**/*.ts', { eager: true })
// const mockModules = Object.keys(modules).map((key) => modules[key].default || modules[key])

export function setupProdMockServer() {
  createProdMockServer([...userMock])
  // 或者使用动态导入的方式：
  // createProdMockServer(mockModules.flat())
}
```

## 步骤 3: 在入口文件中加载

在应用的入口文件中，根据环境变量决定是否加载模拟服务：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 开发环境下 vite-plugin-ai-mock 会自动处理
// 生产环境需要手动加载
if (import.meta.env.PROD && import.meta.env.VITE_USE_MOCK === 'true') {
  import('./mockProdServer').then(({ setupProdMockServer }) => {
    setupProdMockServer()
  })
}

createApp(App).mount('#app')
```

## 步骤 4: 配置环境变量

创建环境变量文件：

```ini
# .env.production
VITE_USE_MOCK=true
```

## 步骤 5: 测试

现在，你可以在生产环境中使用 Fetch API 或 XMLHttpRequest 发起请求，它们都会被 mock 服务拦截：

```typescript
// 使用 Fetch API
fetch('/api/users')
  .then((res) => res.json())
  .then((data) => console.log('Fetch API 结果:', data))

// 使用 XMLHttpRequest
const xhr = new XMLHttpRequest()
xhr.open('GET', '/api/users/1')
xhr.onload = () => {
  console.log('XHR 结果:', JSON.parse(xhr.responseText))
}
xhr.send()
```

## 注意事项

1. 单独打包的 client 模块支持 tree-shaking，可以减小打包体积
2. 同时支持 Fetch API 和 XMLHttpRequest
3. 支持 RESTful API 风格的 URL 匹配
4. 支持响应延迟、自定义状态码等高级功能
5. 可以与 MockJS 结合使用生成更复杂的数据
