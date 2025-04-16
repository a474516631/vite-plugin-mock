/**
 * 从JSON响应生成TypeScript类型定义
 * @param jsonData 录制的JSON响应数据
 * @param typeName 类型名称
 * @returns 生成的TypeScript类型定义字符串
 */
export async function generateTypeFromJson(jsonData: any, typeName: string): Promise<string> {
  try {
    // 使用 json_typegen_wasm 生成类型
    const { run } = await import('json_typegen_wasm')
    const typeDefStr = run(
      typeName,
      JSON.stringify(jsonData),
      JSON.stringify({
        output_mode: 'typescript',
      }),
    )
    console.log(typeDefStr)
    return typeDefStr
  } catch (error) {
    console.error('生成类型定义失败:', error)
    return `interface ${typeName} {\n  // 自动生成失败\n  [key: string]: any;\n}`
  }
}

/**
 * 根据URL生成类型名称
 * @param url API URL
 * @returns 类型名称
 */
export function generateTypeNameFromUrl(url: string): string {
  const urlParts = url.split('/')
  const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || ''

  // 转换为帕斯卡命名
  return (
    lastPart
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Response'
  )
}

/**
 * 查找接口文件并生成类型
 * @param url API URL
 * @param jsonData 响应数据
 * @returns 生成的类型信息
 */
export async function generateTypeDefinition(url: string, jsonData: any) {
  try {
    // 生成类型名称
    const typeName = generateTypeNameFromUrl(url)

    // 生成类型定义
    const typeDefinition = await generateTypeFromJson(jsonData, typeName)

    return {
      url,
      typeName,
      typeDefinition,
    }
  } catch (error) {
    console.error('生成类型定义失败:', error)
    throw error
  }
}

/**
 * 发送类型定义到后端进行文件写入
 * @param typeInfo 类型信息
 * @returns 处理结果
 */
export async function writeTypeDefinitionToFile(typeInfo: {
  url: string
  method: string
  typeName: string
  typeDefinition: string
}) {
  try {
    const response = await fetch('/__mock_api/write-type-definition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(typeInfo),
    })

    return await response.json()
  } catch (error) {
    console.error('写入类型定义失败:', error)
    throw error
  }
}
