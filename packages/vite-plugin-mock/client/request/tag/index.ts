import type { BatchCustomTagReq, CustomTagData, CustomTagReq, EditorCustomTagReq } from './types'
import { webGet, webPost } from '..'

/**
 * 获取自定义标签
 */
export function getCustomTag(query: CustomTagReq): Promise<CustomTagData> {
  return webGet<CustomTagData>('/assistantweb/api/customtag/getcustomtag', query)
}
/**
 * 删除自定义标签
 */
export function batchDelTag(params: BatchCustomTagReq) {
  return webPost<any>('/assistantweb/api/customtag/batchdeltag', params)
}

/**
 * 编辑自定义标签
 */
export function editorCustomTag(params: EditorCustomTagReq) {
  return webPost<any>('/assistantweb/api/customtag/edittag', params)
}
