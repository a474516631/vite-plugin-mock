import type { AssistantUserInfo, GetSensitiveWordResp } from './types'
import { transferPrefixGet } from '..'
import { webGet } from '../index'

/**
 * 通过RemoteId获取学生uid
 */
export function getAssistantInfoByAssistantUid(query?: { assistantUid: Id }) {
  return transferPrefixGet('/assistantdesk/api/user/userinfo', query) as Promise<AssistantUserInfo>
}

/**
 * 获取敏感词
 */
export function getSensitiveWord() {
  return webGet(
    '/assistantweb/api/assistant/getgroupsensitivewords',
  ) as Promise<GetSensitiveWordResp>
}
