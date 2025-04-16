import fs from 'node:fs'
import path from 'node:path'
import { Recordable, ViteMockOptions } from './types'
import { parse, Lang } from '@ast-grep/napi'
import { loggerOutput } from './utils'

/**
 * 查找接口文件并更新或添加类型定义
 * @param filePath 接口文件路径
 * @param url API URL
 * @param typeDefinition 生成的类型定义
 * @param typeName 类型名称
 */
export function updateTypeInFile(
  filePath: string,
  url: string,
  typeDefinition: string,
  typeName: string,
): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`文件不存在: ${filePath}`)
      return false
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const ast = parse(Lang.TypeScript, fileContent)
    const root = ast.root()

    // 1. 尝试查找并更新现有类型定义
    const typePattern = `interface ${typeName} {$$$}`
    const existingType = root.find(typePattern)

    if (existingType) {
      // 更新现有类型
      const range = existingType.range()
      const startIndex = range.start.index
      const endIndex = range.end.index
      const newContent =
        fileContent.substring(0, startIndex) + typeDefinition + fileContent.substring(endIndex)
      fs.writeFileSync(filePath, newContent, 'utf8')
      return true
    }

    // 2. 查找接口函数位置，在函数前添加类型定义
    // 这里假设URL是字符串形式的，可能需要处理引号
    const cleanUrl = url.replace(/^\//, '') // 移除开头的/
    const funcPatterns = [
      `export function $NAME($$$):Promise<$$$?> {$$$${cleanUrl}$$$}`,
      `export function $NAME($$$) {$$$${cleanUrl}$$$}`,
      `export const $NAME = ($$$):Promise<$$$?> => {$$$${cleanUrl}$$$}`,
    ]

    for (const pattern of funcPatterns) {
      const funcNode = root.find(pattern)
      if (funcNode) {
        // 在函数前添加类型定义
        const range = funcNode.range()
        const startIndex = range.start.index
        const newContent =
          fileContent.substring(0, startIndex) +
          typeDefinition +
          '\n\n' +
          fileContent.substring(startIndex)
        fs.writeFileSync(filePath, newContent, 'utf8')
        return true
      }
    }

    // 3. 如果没有找到匹配的函数，则在文件末尾添加
    fs.writeFileSync(
      filePath,
      fileContent + '\n\n// 自动生成的类型定义 - 请移动到正确的位置\n' + typeDefinition,
      'utf8',
    )
    return true
  } catch (error) {
    console.error(`更新文件 ${filePath} 失败:`, error)
    return false
  }
}

/**
 * 根据URL查找对应的接口文件
 * @param apiUrl API URL
 * @param requestPath 接口文件所在目录
 * @returns 匹配的文件路径数组
 */
export function findInterfaceFileByUrl(apiUrl: string, requestPath: string): string[] {
  const matchingFiles: string[] = []

  if (!fs.existsSync(requestPath)) {
    return matchingFiles
  }

  // 递归查找包含该URL的文件
  function searchInDirectory(dirPath: string) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        searchInDirectory(fullPath)
      } else if (entry.isFile() && /\.(ts|js)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8')
        // 简单搜索，可能需要更复杂的匹配逻辑
        if (content.includes(apiUrl)) {
          matchingFiles.push(fullPath)
        }
      }
    }
  }

  searchInDirectory(requestPath)
  return matchingFiles
}

/**
 * 从录制的接口数据生成类型定义并写入接口文件
 * @deprecated 已废弃，请使用前端生成类型功能
 * @param recordedData 录制的接口数据
 * @param opt 插件配置选项
 * @returns 处理结果
 */
export async function generateTypesFromRecordedData(
  recordedData: {
    url: string
    method: string
    response: any
  },
  opt: ViteMockOptions,
): Promise<{ success: boolean; message: string }> {
  return {
    success: false,
    message: '此功能已废弃，请使用新的前端类型生成功能',
  }
}
