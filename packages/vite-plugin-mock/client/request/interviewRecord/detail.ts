import type { IToDoItem } from './types'
import { transferPrefixGet, transferPrefixPost } from '../'

/**
 * @description 维系记录详情-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/889453
 * @updateDate 2024-11-25 10:09:47
 */
export interface IInterviewDetailReqQuery {
  studentUid: string
  callId: string
  /** 2:电话外呼，3:微信语音 */
  type: string
}

/**
 * @description 维系记录详情-响应体
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/889453
 * @updateDate 2024-11-08 17:14:44
 */
export interface IInterviewDetailResData {
  baseInfo?: {
    interviewType?: number
    assistantName?: string
    assistantUid?: number
    courseId?: number
    courseName?: string
    customDeviceId?: string
    // 沟通对象身份
    customDeviceBelonger?: string
    createTime?: number
    interviewTypeStr: string
  }
  abstractInfo?: {
    content?: string
    todo?: IToDoItem
    tags: {
      tagkey: string
      taginfo: string
    }[]
    topic: string[]
  }
  interviewInfo: {
    content?: string
    callId: string
    fileUrl: string
    startTime: number
  }
}

export type MessageList = Array<{
  sentence_id: number
  start_time: number
  end_time: number
  role: number
  content: string
}>

/**
 * @description 维系记录详情
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/889453
 */
export function interviewDetail(
  params: IInterviewDetailReqQuery,
): Promise<IInterviewDetailResData> {
  return transferPrefixGet<IInterviewDetailResData>(
    '/assistantdeskgo/bailing/interview/detail',
    params,
  )
}

/**
 * @description 删除AI标签-post请求体
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/895031
 * @updateDate 2024-11-27 19:04:16
 */
export interface IInterviewHidetagReqBody {
  callId?: Id
  studentUid?: Id
  type?: number
  tags?: string[]
}

/**
 * @description 删除AI标签
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/895031
 */
export function interviewHidetag(params: IInterviewHidetagReqBody): Promise<boolean> {
  return transferPrefixPost('/assistantdeskgo/bailing/interview/hidetag', params)
}
