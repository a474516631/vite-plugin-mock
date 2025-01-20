import type {
  IAssistantListtalkResBody,
  IChatwordGetmd5ReqBody,
  IChatwordGetmd5ResBody,
  IChatwordGetstaffuidResBody,
  IChatwordListcategoryResBody,
  IChatwordListtalkReqQuery,
  IChatwordSavemd5ReqBody,
  IChatwordSavemd5ResBody,
  IChatwordTomessagegroupReqBody,
  IChatwordTomessagegroupResBody,
  IChatworkListallresourceReqQuery,
  IChatworkListallresourceResBody,
  IWeworkhelperFeedbackReqQuery,
  IWeworkhelperGetvariableReqQuery,
  IWeworkhelperGetvariableResBody,
  IWeworkhelperListcategoryResBody,
} from './types'

import { webFormPost, webGet } from '../index'

export enum WordsLibrary {
  // 智见助手话术分类
  listCategory = '/assistantdeskgo/chatwork/weworkhelper/listcategory',
  // 工作台话术搜索
  listtalk = '/assistantweb/api/chatword/listtalk',
  // 智见助手变量名替换
  getvariable = '/assistantweb/api/chatword/getvariable',
  // 点赞之类的操作
  feedback = '/assistantweb/api/chatword/feedback',
  // 获取全部资源
  listallresource = '/assistantweb/api/chatword/listresource',
}
/**
 * @description 工作台话术搜索
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864923
 */
export async function assistantListtalk(
  params: IChatwordListtalkReqQuery,
): Promise<IAssistantListtalkResBody> {
  return webGet(WordsLibrary.listtalk, params)
}

/**
 * @description 智见助手话术分类
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864908
 */
export async function weworkhelperListcategory(): Promise<IWeworkhelperListcategoryResBody> {
  return webGet<IWeworkhelperListcategoryResBody>(WordsLibrary.listCategory, {})
}

/**
 * @description 智见助手变量名替换
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/865383
 */
export async function weworkhelperGetvariable(
  params: IWeworkhelperGetvariableReqQuery,
): Promise<IWeworkhelperGetvariableResBody> {
  return webFormPost(WordsLibrary.getvariable, params)
}

/**
 * @description 智见助手话术反馈
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864942
 */
export async function weworkhelperFeedback(params: IWeworkhelperFeedbackReqQuery): Promise<{
  errNo: number
  errMsg?: string
  data: any
}> {
  return webFormPost(WordsLibrary.feedback, params)
}

/**
 * @description 获取所有资源
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/866314
 */
export async function chatworkListallresource(
  params: IChatworkListallresourceReqQuery,
): Promise<IChatworkListallresourceResBody> {
  return webGet(WordsLibrary.listallresource, params)
}
/**
 * @description 智建助手获取md5
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867263
 */
export async function chatwordGetmd5(
  params: IChatwordGetmd5ReqBody,
): Promise<IChatwordGetmd5ResBody> {
  return webFormPost('/assistantweb/api/chatword/getmd5', params)
}

/**
 * @description 智建助手保存md5
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867253
 */
export async function chatwordSavemd5(
  params: IChatwordSavemd5ReqBody,
): Promise<IChatwordSavemd5ResBody> {
  return webFormPost('/assistantweb/api/chatword/savemd5', params)
}

/**
 * @description 智见助手话术分类
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864908
 */
export async function chatwordListcategory(): Promise<IChatwordListcategoryResBody> {
  return webGet('/assistantweb/api/chatword/listcategory')
}

/**
 * @description 智见助手获取资产id
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/868159
 */
export async function chatwordGetstaffuid(): Promise<IChatwordGetstaffuidResBody> {
  return webGet('/assistantweb/api/chatword/getstaffuid')
}

/**
 * @description 智见助手话术转存消息组
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867527
 */
export async function chatwordTomessagegroup(
  params: IChatwordTomessagegroupReqBody,
): Promise<IChatwordTomessagegroupResBody> {
  return webFormPost('/assistantweb/api/chatword/tomessagegroup', params)
}
