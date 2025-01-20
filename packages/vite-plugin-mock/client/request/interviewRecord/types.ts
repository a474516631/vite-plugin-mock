import type { WithCourse } from '../student/types'

export interface InterviewRecordBaseReq {
  type: number
  studentUid: Id
  assistantUid: Id
}

export type InterviewRecordReq = WithCourse<InterviewRecordBaseReq> & { origin: number }

export interface EditInterviewRecordBaseReq {
  studentUid: Id
  assistantUid: Id
  // phaseKey: number;
  content: string
  phaseId: Id
  friendliness: number
  roleType: number
  channelType: string
  interviewType: string
}

export type EditInterviewRecordReq = WithCourse<EditInterviewRecordBaseReq>
export interface GetMainTainOptionReq {
  courseId: number
}
export interface GetMainTainOptionResp {
  option: number
}

/**
 * @description 维系记录列表-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/889450
 * @updateDate 2024-11-22 10:41:43
 */
export interface IInterviewListReqQuery {
  courseId: Id
  studentUid: Id
  assistantUid?: Id
  /** 时间戳，用作翻页用，首次传0，每次翻页传上一页最后一条数据返回字段值 */
  lastTime: number
  /** 条数 < 20 */
  pageSize: number
  isMyself: 0 | 1
}

export enum InterviewRecordType {
  MANUAL = 1, // 手动
  CALL = 2, // 电话
  WECHAT = 3, // 微信
  VIDEO = 4, // 微信视频
}

export enum InterviewType {
  MANUAL = 1, // 手动
  AI = 2, // AI
}

export enum InterviewResult {
  CALLING = 1, // 呼叫中
  CONNECTED = 2, // 已接通
  NOT_CONNECTED = 3, // 未接通
}
// 0待处理，1 语音识别中，2/3，AI摘要中，4摘要完成
export enum InterviewStatus {
  TO_DO = 0, // 待处理
  IDENTIFYING = 1, // speechRecognition
  AI_SUMMARIZING = 2, // AI摘要中
  AI_SUMMARIZING3 = 3, // AI摘要中
  AI_SUMMARIZED = 4, // 摘要完成
}

export interface IToDoItem {
  remindId?: number
  content?: string
  createUid?: number
  posRemindTime?: string
  remindTime?: string
  type?: number
  fromType: number
  currentRemindId: Id
  status?: number
}

export interface IInterviewRecord {
  id: Id
  /** 1人填；2电话；3微信语音；4微信视频 */
  type: InterviewRecordType
  /** 1人填；2AI */
  interviewType?: InterviewType
  courseId?: number
  studentUid?: number
  callAssistantUid?: number
  callAssistantName?: string
  /** 开始时间 */
  startTime: number
  /** 时长 */
  duration?: number
  /** 标签 */
  abstractInfo?: {
    tags?: {
      tagkey: string
      taginfo: string
    }[]
    todo?: IToDoItem
    content?: string
  }
  /** 0待处理，1语音识别中，2/3，AI摘要中，4摘要完成 */
  status?: number
  /** 1呼叫中；2已接通；3未接通 */
  result?: number
  /** 待办 */
  // 学科
  subject?: string
  topic?: string[]
}

/**
 * @description 维系记录列表-响应体
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/889450
 * @updateDate 2024-11-06 16:02:02
 */
export interface IInterviewListResData {
  list: IInterviewRecord[]
}

/**
 * @description 删除Ai摘要标签-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/892794
 * @updateDate 2024-11-15 18:14:27
 */
export interface IInterviewDeletetagReqQuery {
  callId: Id
  tag: string
}

/**
 * @description 删除Ai摘要标签-响应体
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/892794
 * @updateDate 2024-11-15 18:14:27
 */
export type InterviewDeletetagResData = boolean
