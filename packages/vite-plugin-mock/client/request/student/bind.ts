import type { BindWechatReq, GetMatchListReq, GetMatchListResp, UnbindWechatReq } from './types'
import { transferPrefixGet } from '..'

export const BindStudentApi = {
  GetMatchList: `/muse/wechat/api/matchlist`,
  GetMatchListIntro: `/muse/wechat/api/matchlistintro`,
  // 新版-绑定
  BindWechat: `/muse/wechat/api/wechatworkbind`,
  // 新版-解绑
  UnbindWechat: `/muse/wechat/api/wechatworkunbind`,
  // 转介绍绑定
  BindTransIntroWechat: `/muse/wechat/api/wechatworkbindintro`,
  // 转介绍解绑
  UnBindTransIntroWechat: `/muse/wechat/api/wechatworkunbindintro`,
}

/**
 *
 * 根据uid或者手机号获取匹配的学生列表，用于绑定。
 */
export function getMatchList(params: GetMatchListReq): Promise<GetMatchListResp> {
  return transferPrefixGet(BindStudentApi.GetMatchList, params)
}
/**
 * 绑定学生ID。
 */
export function bindWechat(params: BindWechatReq): Promise<{
  result: boolean
}> {
  return transferPrefixGet(BindStudentApi.BindWechat, params)
}

/**
 * 转介绍绑定学生ID。
 */
export function bindTransIntroWechat(params: BindWechatReq): Promise<any> {
  return transferPrefixGet(BindStudentApi.BindTransIntroWechat, params)
}

/**
 * 解绑学生ID。
 */
export function unbindWechat(params: UnbindWechatReq): Promise<{
  result: boolean
}> {
  return transferPrefixGet(BindStudentApi.UnbindWechat, params)
}
