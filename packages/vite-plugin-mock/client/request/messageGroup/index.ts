import type {
  GetStudentIdByWexinIdReq,
  GetStudentIdByWexinIdResp,
  UserInfoReq,
  UserInfoResp,
} from '@/types/kp-right'
import type {
  GetMessageGroupDetailReq,
  GetMessageGroupDetailRespData,
  GetTeamListReq,
  GetTeamListRespData,
  PostSendMessageReq,
  PostSendMessageRespData,
  SendMessageCheckData,
  SendMessageCheckReq,
} from './types'
import { webFormPost, webGet } from '../index'

export const MessageGroup = {
  UserInfo: '/assistantweb/api/assistant/getuserinfo',
  GetStudentUidByWexinId: '/assistantweb/api/assistant/getstudentuidbywxid',
  TeamList: '/assistantweb/api/assistantdeskgo/sidelist',
  MessageDetail: '/assistantweb/api/assistantdeskgo/messagegroupdetail',
  SendMessage: '/assistantweb/api/assistant/sendmessage',
  SendMessageCheck: '/assistantweb/api/assistant/sendmessagecheck',
}
/**
 * @description 个人创建/团队共享列表
 * @url http://yapi.zuoyebang.cc/project/10480/interface/api/821712
 */
export function getTeamList(params: GetTeamListReq): Promise<GetTeamListRespData> {
  return webGet(MessageGroup.TeamList, params)
}
/**
 * @description 获取单个消息组信息接口
 * @url http://yapi.zuoyebang.cc/project/10480/interface/api/821672
 */
export function getMessageGroupDetail(
  params: GetMessageGroupDetailReq,
): Promise<GetMessageGroupDetailRespData> {
  return webGet(MessageGroup.MessageDetail, params)
}

/**
 * @description 发送消息
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/821896
 */
export function postSendMessage(params: PostSendMessageReq): Promise<PostSendMessageRespData> {
  return webFormPost(MessageGroup.SendMessage, params)
}

/**
 * 获取用户信息。
 * 同旧的：/assistantdesk/api/user/userinfo
 */
export function userInfo(params: UserInfoReq): Promise<UserInfoResp> {
  return webGet(MessageGroup.UserInfo, params)
}

/**
 * 根据微信ID获取学生ID。
 * 同旧的：/assistantdesk/api/student/getstudentuidbywexinid
 */
export function getStudentIdByWexinId(
  params: GetStudentIdByWexinIdReq,
): Promise<GetStudentIdByWexinIdResp> {
  return webGet(MessageGroup.GetStudentUidByWexinId, params)
}

/**
 * @description 单发sop校验接口
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/832728
 */
export function sendMessageCheck(params: SendMessageCheckReq): Promise<SendMessageCheckData> {
  return webFormPost(MessageGroup.SendMessageCheck, params)
}
