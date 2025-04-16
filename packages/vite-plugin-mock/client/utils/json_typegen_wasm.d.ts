declare module 'json_typegen_wasm' {
  /**
   * 从JSON字符串生成TypeScript类型定义
   * @param jsonString JSON字符串
   * @param rootName 根类型名称
   * @param options 配置选项
   * @returns 生成的TypeScript类型定义字符串
   */
  export function run(rootName: string, jsonString: string, options: string): string
}
