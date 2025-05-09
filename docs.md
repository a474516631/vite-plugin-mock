# vite-plugin-ai-mock 使用文档

## 简介

vite-plugin-ai-mock 是一个为 Vite 项目提供智能数据模拟服务的插件。它支持在开发环境和生产环境中使用，在开发环境中使用 Connect 中间件实现，在生产环境中使用 mockjs。这个插件可以帮助前端开发者在没有后端 API 的情况下进行开发和测试。

最新版本增加了多项智能化增强功能，包括 AI 生成模拟数据、自动分析 TypeScript 接口类型、接口录制、分场景配置等高级特性，大大提升了前端开发的效率。

## 安装

首先，您需要安装必要的依赖：

```bash
# 安装 mockjs
npm install mockjs -S
# 或
yarn add mockjs
# 或
pnpm add mockjs

# 安装 vite-plugin-ai-mock
npm install vite-plugin-ai-mock -D
# 或
yarn add vite-plugin-ai-mock -D
# 或
pnpm add vite-plugin-ai-mock -D
```

## 基本配置

在 `vite.config.ts` 中配置插件：

```typescript
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-ai-mock'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      // mock 文件存放的目录
      mockPath: 'mock',
      // 是否启用
      enable: true,
      // 是否在控制台显示请求日志
      logger: true,
    }),
  ],
})
```

## 配置选项

根据 `types.ts` 文件中的 `ViteMockOptions` 接口，以下是可用的配置选项：

| 选项              | 类型                                      | 默认值 | 描述                                           |
| ----------------- | ----------------------------------------- | ------ | ---------------------------------------------- |
| mockPath          | string                                    | 'mock' | 模拟数据文件存放的目录                         |
| configPath        | string                                    | -      | 配置文件路径，如果设置此项，mockPath 将被忽略  |
| ignore            | RegExp \| ((fileName: string) => boolean) | -      | 忽略的请求或文件                               |
| watchFiles        | boolean                                   | true   | 是否监听文件变化并实时更新                     |
| enable            | boolean                                   | true   | 是否启用模拟功能                               |
| logger            | boolean                                   | true   | 是否在控制台显示请求日志                       |
| cors              | boolean                                   | true   | 是否启用跨域支持                               |
| prefix            | string                                    | '/api' | 请求前缀                                       |
| record            | boolean                                   | -      | 是否记录请求，启用接口录制功能                 |
| recordExclude     | string \| string[]                        | -      | 录制时要排除的请求                             |
| requestPath       | string                                    | -      | 请求存放的文件夹，用于分析请求类型             |
| openAIApiKey      | string                                    | -      | OpenAI API 密钥，用于自动生成模拟数据          |
| modelName         | string                                    | -      | 使用的 LLM 模型名称                            |
| findInterfaceType | string                                    | -      | 查找接口类型的 ast-grep 规则                   |
| scene             | string                                    | -      | 场景设置，用于根据不同场景加载不同的 mock 数据 |

## 创建模拟数据

### 模拟文件格式

在指定的 `mockPath` 目录（默认为 'mock'）中创建模拟数据文件。文件应导出一个数组或一个返回数组的函数：

```typescript
// mock/user.ts
import { MockMethod, MockConfig } from 'vite-plugin-ai-mock'

// 方法一：直接导出数组
export default [
  {
    url: '/api/user/list',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: [
          { id: 1, name: '张三' },
          { id: 2, name: '李四' },
        ],
        message: '获取成功',
      }
    },
  },
] as MockMethod[]

// 方法二：导出一个函数，接收配置对象
export default function (config: MockConfig) {
  return [
    {
      url: '/api/user/info',
      method: 'get',
      response: ({ query }) => {
        const { id } = query
        return {
          code: 0,
          data: { id, name: id === '1' ? '张三' : '李四' },
          message: '获取成功',
        }
      },
    },
  ]
}
```

### MockMethod 接口

每个模拟接口的配置项遵循 `MockMethod` 接口：

```typescript
interface MockMethod {
  // 请求地址
  url: string
  // 请求方法：get, post, put, delete, patch
  method?: MethodType
  // 设置响应延迟时间（毫秒）
  timeout?: number
  // 响应状态码
  statusCode?: number
  // 响应数据（JSON 格式）
  response?: (
    this: RespThisType,
    opt: {
      url: Recordable
      body: Recordable
      query: Recordable
      headers: Recordable
    },
  ) => any | any
  // 自定义响应（非 JSON 格式）
  rawResponse?: (this: RespThisType, req: IncomingMessage, res: ServerResponse) => void
}
```

### 响应处理

可以通过两种方式定义响应：

1. **response 选项**：用于返回 JSON 格式的响应，可以是一个对象或一个函数。

```typescript
// 对象形式
response: {
  code: 0,
  data: { name: '张三' },
  message: '成功',
}

// 函数形式
response: ({ query, body, headers }) => {
  console.log('查询参数:', query)
  console.log('请求体:', body)
  console.log('请求头:', headers)

  return {
    code: 0,
    data: { name: '张三', id: query.id },
    message: '成功',
  }
}
```

2. **rawResponse 选项**：用于自定义非 JSON 格式的响应。

```typescript
rawResponse: async (req, res) => {
  let reqBody = ''
  await new Promise((resolve) => {
    req.on('data', (chunk) => {
      reqBody += chunk
    })
    req.on('end', () => resolve(undefined))
  })

  res.setHeader('Content-Type', 'text/plain')
  res.statusCode = 200
  res.end(`hello, ${reqBody}`)
}
```

## 新增功能

### 从录制接口自动生成类型定义

vite-plugin-ai-mock 支持基于录制的接口响应数据自动生成 TypeScript 类型定义，并将其写入到对应的接口文件中：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-ai-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      record: true,
      requestPath: 'src/api', // 你的接口定义所在目录
    }),
  ],
})
```

#### 类型生成技术实现

最新版本使用 WASM 技术在前端生成类型：

1. **浏览器中生成类型**：使用 `json_typegen_wasm` 在浏览器直接生成 TypeScript 类型定义，无需将数据传输到后端
2. **后端仅负责文件写入**：前端生成类型后，将结果发送到后端处理文件查找和写入操作
3. **类型预览功能**：生成类型后会在界面上显示预览，便于检查类型定义的准确性
4. **文件查找和更新**：系统会自动查找接口文件并更新或添加类型定义

#### 使用步骤

1. 确保配置了 `requestPath` 指向你的接口文件目录
2. 录制接口数据（通过正常使用应用进行 API 调用）
3. 访问 `http://localhost:端口号/__mock` 打开 mock 管理界面
4. 找到你需要生成类型的接口
5. 点击页面上的"生成类型"按钮
6. 界面会显示生成的类型定义预览，并自动写入到对应的接口文件

#### 类型生成流程

1. 前端使用 `json_typegen_wasm` 从 API 响应中生成 TypeScript 类型定义
2. 显示类型定义预览
3. 将类型定义发送到后端
4. 后端查找匹配的接口文件
5. 使用 `ast-grep` 定位文件中的适当位置
6. 将类型定义写入到接口文件

#### 类型生成示例

假设你有以下接口文件：

```typescript
// src/api/user.ts
export function getUserInfo(id: string): Promise<any> {
  return request('/api/user/info', { id })
}
```

当你录制 `/api/user/info` 接口的响应并点击 "生成类型" 后，系统将自动生成类型并更新接口文件：

```typescript
// src/api/user.ts
interface UserInfoResponse {
  code: number
  data: {
    id: string
    name: string
    age: number
    email: string
    address: string
  }
  message: string
}

export function getUserInfo(id: string): Promise<UserInfoResponse> {
  return request('/api/user/info', { id })
}
```

#### 类型生成配置

类型生成功能支持以下配置：

- **requestPath**: 设置接口文件目录，用于查找和更新文件
- **findInterfaceType**: 自定义 ast-grep 规则，精确定位类型插入位置（可选）

#### 注意事项

1. 确保接口文件中的 URL 与录制的请求 URL 一致，这样系统才能正确找到要更新的文件
2. 生成的类型定义基于实际响应，可能不包含所有可能的字段或情况
3. 对于复杂结构，可能需要手动调整生成的类型
4. 如果找不到合适的位置插入类型，它会添加到文件末尾

### 接口录制功能

接口录制是 vite-plugin-ai-mock 的核心功能之一，它允许您自动捕获和记录真实后端 API 的请求和响应，然后用于生成精确的模拟数据：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-ai-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      // 启用接口录制
      record: true,
      // 排除特定的 API
      recordExclude: ['/api/healthcheck', '/api/metrics'],
      // 代理设置（如果需要）
      server: {
        proxy: {
          '/api': {
            target: 'https://real-backend.com',
            changeOrigin: true,
          },
        },
      },
    }),
  ],
})
```

启用录制功能后，当您的前端应用发起 API 请求时，插件会：

1. 将请求转发到实际的后端服务器
2. 记录请求的详细信息（URL、方法、请求体、查询参数等）
3. 记录后端的响应数据
4. 自动在 mockPath 目录中生成对应的模拟文件

这样，您就可以用真实的后端响应来构建高度准确的模拟数据。当后端 API 变化时，只需重新录制即可更新模拟数据。

#### 录制文件结构

录制生成的文件通常按照请求路径组织，例如：

```
mock/
  ├── recorded/
  │   ├── api/
  │   │   ├── user/
  │   │   │   ├── login.ts  // 对应 /api/user/login 请求
  │   │   │   └── info.ts   // 对应 /api/user/info 请求
  │   │   └── products/
  │   │       └── list.ts   // 对应 /api/products/list 请求
```

每个文件包含请求的详细信息和对应的响应数据，您可以根据需要编辑这些文件来调整模拟行为。

### 场景（Scene）配置

通过配置 `scene` 选项，您可以在不同场景下加载不同的 mock 数据，这对于处理多环境或多业务场景非常有用：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-ai-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      scene: 'scenario1', // 加载 mock/scenario1 目录下的 mock 文件
    }),
  ],
})
```

目录结构示例：

```
mock/
  ├── scenario1/           # 场景1的模拟数据
  │   ├── user.ts
  │   └── product.ts
  ├── scenario2/           # 场景2的模拟数据
  │   ├── user.ts
  │   └── product.ts
  └── common/              # 通用模拟数据
      └── utils.ts
```

### TypeScript 接口类型分析

通过配置 `requestPath` 选项，插件可以自动分析您的 TypeScript 接口定义，并基于这些类型生成符合类型要求的模拟数据：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-ai-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      requestPath: 'src/api', // TypeScript 接口定义所在目录
    }),
  ],
})
```

插件将分析 `src/api` 目录下的 TypeScript 文件，识别接口定义和请求函数，然后自动提取接口类型信息。插件支持多种 API 调用模式的识别，包括：

- Promise 风格
- Axios 风格
- Request 方法风格
- 箭头函数风格

您还可以通过 `findInterfaceType` 配置自定义 ast-grep 规则来匹配您特定的接口模式。

### AI 生成模拟数据

通过配置 `openAIApiKey` 和 `modelName`，插件可以利用 AI 模型自动生成符合接口类型的模拟数据：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-ai-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      requestPath: 'src/api',
      openAIApiKey: 'your-openai-api-key',
      modelName: 'gpt-3.5-turbo', // 或其他支持的模型
    }),
  ],
})
```

启用此功能后，当插件无法找到特定接口的模拟数据时，它会利用 AI 模型根据接口类型定义自动生成合适的模拟数据。AI 将分析接口结构，生成符合类型要求的 JSON 数据。

### 模板生成

插件提供了模板生成功能，可以快速创建基础的 mock 文件：

```typescript
// 使用 mockTsStrTemplate 生成模板
import { mockTsStrTemplate } from 'vite-plugin-ai-mock/dist/template'

const mockFileContent = mockTsStrTemplate({
  reqUrl: '/user/info',
  reqMethod: 'get',
  prefix: '/api',
})

// 然后可以将内容写入文件
fs.writeFileSync('mock/user.ts', mockFileContent)
```

生成的模板会包含基本的 mock 结构，您可以在此基础上进一步定制。

## 生产环境配置

如果需要在生产环境中使用模拟数据，需要额外的配置：

1. 创建 `mockProdServer.ts` 文件：

```typescript
// mockProdServer.ts
import { createProdMockServer } from 'vite-plugin-ai-mock/client'

// 导入所有模拟数据文件
// 可以使用 import.meta.glob 导入多个文件
import userMock from './mock/user'
import productMock from './mock/product'

export function setupProdMockServer() {
  createProdMockServer([...userMock, ...productMock])
}
```

> **注意**：从 3.0.3-beta.11 版本开始，client 模块已被单独打包，支持更好的按需导入和 tree-shaking。请确保使用正确的导入路径 `vite-plugin-ai-mock/client`。

该模块同时支持 XMLHttpRequest 和 fetch API，可以拦截前端所有类型的请求。

2. 在项目入口文件中导入并调用：

```typescript
// main.ts
import { setupProdMockServer } from './mockProdServer'

// 根据环境变量判断是否需要启用模拟
if (import.meta.env.PROD && import.meta.env.VITE_USE_MOCK === 'true') {
  setupProdMockServer()
}

// ... 其他代码
```

3. 配置 vite.config.ts：

```typescript
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-ai-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      enable: true,
      // 生产环境配置
      prodEnabled: true,
      injectCode: `
        import { setupProdMockServer } from './mockProdServer';
        setupProdMockServer();
      `,
    }),
  ],
})
```

## 进阶用法

### 使用 RESTful API

支持 RESTful 风格的 API，可以在 URL 中使用参数：

```typescript
{
  url: '/api/users/:id',
  method: 'get',
  response: ({ url }) => {
    const id = url.id
    return {
      code: 0,
      data: { id, name: `用户${id}` },
    }
  },
}
```

### 响应延迟

可以设置响应延迟来模拟网络延迟：

```typescript
{
  url: '/api/slow-request',
  method: 'get',
  timeout: 2000, // 2秒后返回响应
  response: {
    code: 0,
    data: { message: '请求成功' },
  },
}
```

### 使用 MockJS 增强数据

可以结合 MockJS 生成更复杂的模拟数据：

```typescript
import Mock from 'mockjs'

export default [
  {
    url: '/api/users/list',
    method: 'get',
    response: () => {
      const data = Mock.mock({
        'list|1-100': [
          {
            'id|+1': 1,
            name: '@cname',
            email: '@email',
            address: '@city(true)',
            created_at: '@datetime',
          },
        ],
      })

      return {
        code: 0,
        data: data.list,
      }
    },
  },
]
```

## 注意事项

1. 在 mock 文件中不要使用 Node.js 模块，否则可能导致生产环境失败。
2. 生产环境中的模拟功能仅适用于测试，不要在正式环境中启用。
3. 在生产环境中，模拟功能可能会影响正常的 Ajax 请求，如文件上传/下载。
4. 请谨慎使用 `openAIApiKey` 等 LLM 相关功能，确保 API 密钥的安全。
5. 当使用 TypeScript 类型分析功能时，需要确保 `requestPath` 指向的目录包含正确格式的 API 定义。
6. 启用接口录制功能时，确保服务器代理设置正确，以便能够正常访问后端服务。
7. 使用自动类型生成功能时，可能需要手动微调生成的类型定义以满足特定项目的需求。

## 代码分析与维护建议

在使用 vite-plugin-ai-mock 时，建议将模拟数据按照业务模块进行分类和组织，这样可以使代码更加清晰和易于维护。利用 `scene` 功能可以更好地组织不同场景下的模拟数据：

```
mock/
  ├── development/             # 开发环境
  │   ├── user/
  │   │   ├── login.ts
  │   │   ├── info.ts
  │   │   └── list.ts
  │   └── product/
  │       ├── detail.ts
  │       └── list.ts
  ├── testing/                 # 测试环境
  │   ├── user/
  │   └── product/
  ├── recorded/                # 录制的 API 响应
  │   ├── api/
  │   │   └── real/
  │   │       └── endpoints/
  └── common/                  # 通用模拟数据
      └── utils.ts
```

对于大型项目，可以考虑使用以下策略来提高可维护性：

1. 创建通用的响应工具函数，统一处理响应格式。
2. 利用 TypeScript 类型系统，为请求和响应创建接口定义。
3. 考虑将模拟数据与实际 API 接口文档同步，确保模拟数据反映真实 API 的行为。
4. 利用接口录制功能捕获真实 API 的响应，作为模拟数据的基础。
5. 使用自动类型生成功能，从录制的 API 响应数据中推断出精确的类型定义。
6. 结合 AI 生成功能对录制的数据进行增强，添加更多变体和边界情况。
7. 建立明确的开发流程：先录制接口 → 生成类型 → 调整模拟数据 → 开发前端 → 集成真实后端。

vite-plugin-ai-mock 提供了丰富的功能来支持前端开发，尤其是接口录制、自动类型生成和 AI 生成数据功能的组合，可以显著降低模拟数据的维护成本，提高开发效率。随着项目的增长，适当利用这些智能化功能可以确保模拟数据与实际 API 保持一致，并减轻创建和维护模拟数据的工作量。
