import type { GetMessageListReq, GetMessageListResp } from './types'
import { transferPrefixGet, transferPrefixPost } from '..'

enum API {
  /** 消息列表 */
  messageList = '/assistantdeskgo/bailing/message/list',
  /** 消息读取 */
  messageRead = '/assistantdeskgo/bailing/message/read',
}

/** 消息列表 */
export function getMessageList(params: GetMessageListReq): Promise<GetMessageListResp> {
  return transferPrefixGet(API.messageList, params)
}

/** 消息读取 */
export function getMessageRead(params: {
  studentUid: Id
  assistantUid: Id
  id: number
}): Promise<unknown> {
  return transferPrefixPost(API.messageRead, params)
}
