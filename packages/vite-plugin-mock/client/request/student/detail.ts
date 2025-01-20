import type { IWxmessageSetbelongerReqQuery, IWxmessageSetbelongerResBody } from './types'
import { transferPrefixGet } from '..'

/**
 * 通过RemoteId获取学生uid
 */
export function getStudentUidByRemoteId(query?: unknown): Promise<{
  studentUid: Id
}> {
  return transferPrefixGet('/assistantdesk/api/student/getstudentuidbywexinid', query)
}

/**
 * @description 设置微信归属人
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886073
 */
export async function wxmessageSetbelonger(
  params: IWxmessageSetbelongerReqQuery,
): Promise<IWxmessageSetbelongerResBody> {
  return transferPrefixGet('/assistantdeskgo/wxmessage/setbelonger', params)
}
// ========================== 新接口 ========================

/**
 * @description 学生信息-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888235
 * @updateDate 2024-11-05 18:16:42
 */
export interface IStudentStudentdetailReqQuery {
  studentUid: Id
  assistantUid: Id
  personUid: Id
  studentRemoteId: Id
}

/**
 * @description 学生信息-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888235
 * @updateDate 2024-11-05 18:16:42
 */
export interface IStudentStudentdetailResData {
  studentUid?: number
  encryptedStudentUid?: string
  studentName?: string
  namePinyin?: Array<{
    pinyin: string
    chinese: string
  }>
  nickname?: string
  sex?: number
  grade?: number
  school?: string
  phone?: string
  area?: string
  assistantUid?: number
  assistantPhone?: string
  belongObj?: {
    belongStr: string
    belongVal: string
  }
  deviceInfo?: string
}

/**
 * @description 学生信息
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888235
 */
export function bailingStudentDetail(
  params: IStudentStudentdetailReqQuery,
): Promise<IStudentStudentdetailResData> {
  return transferPrefixGet<IStudentStudentdetailResData>(
    '/assistantdeskgo/bailing/student/studentdetail',
    params,
  )
}

/**
 * @description 百灵课程接口-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/889217
 * @updateDate 2024-11-06 13:59:02
 */
export interface IStudentStudentdetailblReqQuery {
  studentUid: Id
  assistantUid: Id
  personUid: Id
  courseId: Id
}

/**
 * @description 百灵课程接口-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/889217
 * @updateDate 2024-11-06 13:59:02
 */
export interface IStudentStudentdetailblResData {
  student: {
    grade?: string
    area?: string
    school?: string
    classOL?: string
    guardianWechatLight?: number
    addressPhone?: string
    serviceType?: number
    classId?: number
    scRemark?: string
    preContinue?: number
    machinePreContinue?: number
    gradeData?: string
    md5AddressPhone?: string
    leadsId: Id
  }
  contactFlagDefault?: string
  contactFlagTime?: string
  tags: {
    label: string
    color: string
    cname: string
    hover: string
    prop: string
    tag?: string
    icon?: string
    borderColor?: string
  }[]
  buttonGroup?: string[]
  isLevelTwo?: number
  isYKT?: boolean
}

/**
 * @description 百灵学生课程相关信息查询
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/889217
 */
export function studentStudentdetailbl(
  params: IStudentStudentdetailblReqQuery,
): Promise<IStudentStudentdetailblResData> {
  return transferPrefixGet<IStudentStudentdetailblResData>(
    '/assistantdesk/api/student/studentdetailbl',
    params,
  )
}

/**
 * @description 根据微信id获取学生id-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/889535
 * @updateDate 2024-11-06 17:39:25
 */
export interface IStudentGetstudentuidbywexinidReqQuery {
  weixinId: Id
  assistantUid: Id
  personUid: Id
}

/**
 * @description 根据微信id获取学生id-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/889535
 * @updateDate 2024-11-06 17:39:25
 */
export interface IStudentGetstudentuidbywexinidResData {
  studentUid?: number
}

/**
 * @description 根据微信id获取学生id
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/889535
 */
export function studentGetstudentuidbywexinid(
  params: IStudentGetstudentuidbywexinidReqQuery,
): Promise<IStudentGetstudentuidbywexinidResData> {
  return transferPrefixGet<IStudentGetstudentuidbywexinidResData>(
    '/assistantdeskgo/bailing/student/getstudentuidbywexinid',
    params,
  )
}
