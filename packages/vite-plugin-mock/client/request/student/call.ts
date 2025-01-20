import type {
  CallReq,
  GetCallTypeListResp,
  ISopGetstudentcallrecordinfoblReqQuery,
  ISopGetstudentcallrecordinfoblResData,
} from './types'
import { transferPrefixGet } from '..'

/**
 * @description 百灵外呼记录
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/885802
 */
export function sopGetstudentcallrecordinfobl(
  params: ISopGetstudentcallrecordinfoblReqQuery,
): Promise<ISopGetstudentcallrecordinfoblResData> {
  return transferPrefixGet<ISopGetstudentcallrecordinfoblResData>(
    '/assistantdesk/api/sop/getstudentcallrecordinfobl',
    params,
  )
}
/**
 * 获取沟通维系类型列表。
 */
export function getCallTypeList(query?: { courseId: Id }): Promise<GetCallTypeListResp> {
  return transferPrefixGet<GetCallTypeListResp>('/assistantdesk/api/sop/getcalltypelist', query)
}

/**
 * 呼叫。
 */
export function call(query: CallReq): Promise<unknown> {
  return transferPrefixGet('/assistantdesk/api/sop/call', query)
}

/**
 * @description 微信归属人信息-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888914
 * @updateDate 2024-11-05 18:16:52
 */
export interface IStudentGetbelongermapResData {
  list: {
    label: number
    value: string
  }[]
}

/**
 * @description 微信归属人信息
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888914
 */
export function studentGetbelongermap(params: any): Promise<IStudentGetbelongermapResData> {
  return transferPrefixGet<IStudentGetbelongermapResData>(
    '/assistantdeskgo/bailing/student/getbelongermap',
    params,
  )
}

/**
 * @description 设置微信归属人-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886073
 * @updateDate 2024-11-05 18:23:42
 */
export interface IStudentSetbelongerReqQuery {
  studentUid: Id
  assistantUid: Id
  belonger: string
  weixinId: string
}

/**
 * @description 设置微信归属人-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886073
 * @updateDate 2024-11-05 18:23:42
 */
export interface IStudentSetbelongerResData {
  result?: boolean
}

/**
 * @description 设置微信归属人
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886073
 */
export function studentSetbelonger(
  params: IStudentSetbelongerReqQuery,
): Promise<IStudentSetbelongerResData> {
  return transferPrefixGet<IStudentSetbelongerResData>(
    '/assistantdeskgo/bailing/student/setbelonger',
    params,
  )
}
