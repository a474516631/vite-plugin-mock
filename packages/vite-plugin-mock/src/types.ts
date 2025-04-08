import { IncomingMessage, ServerResponse } from 'http'

export interface ViteMockOptions {
  // 请求存放的文件夹
  mockPath?: string
  // 配置文件路径
  configPath?: string
  // 忽略的请求
  ignore?: RegExp | ((fileName: string) => boolean)
  // 是否开启 watch
  watchFiles?: boolean
  // 是否开启 mock
  enable?: boolean
  // 是否开启 logger
  logger?: boolean
  // 是否开启 cors
  cors?: boolean
  // 请求前缀
  prefix?: string
  // 是否记录请求
  record?: boolean
  // 记录的排除的请求
  recordExclude?: string | string[]
  // 请求存放的文件夹，分析请求类型需要
  requestPath?: string
  // 模型 api key
  openAIApiKey?: string
  // llm 模型
  modelName?: string
  // 查找接口类型 ast-grep 规则
  findInterfaceType?: string
  // 场景
  scene?: string
}

export interface RespThisType {
  req: IncomingMessage
  res: ServerResponse
  parseJson: () => any
}

export type MethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'

export type Recordable<T = any> = Record<string, T>

export declare interface MockMethod {
  url: string
  method?: MethodType
  timeout?: number
  statusCode?: number
  response?:
    | ((
        this: RespThisType,
        opt: { url: Recordable; body: Recordable; query: Recordable; headers: Recordable },
      ) => any)
    | any
  rawResponse?: (this: RespThisType, req: IncomingMessage, res: ServerResponse) => void
}

export interface MockConfig {
  env: Record<string, any>
  mode: string
  command: 'build' | 'serve'
}
