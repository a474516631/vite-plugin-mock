export interface Req {
  assistantUid: Id
  personUid: Id
}
/**
 * @description 百灵外呼记录-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/885802
 * @updateDate 2024-10-30 15:50:37
 */
export interface ISopGetstudentcallrecordinfoblReqQuery {
  studentUid: Id
  assistantUid: Id
}

/**
 * @description 百灵外呼记录-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/885802
 * @updateDate 2024-10-30 15:50:37
 */
export interface ISopGetstudentcallrecordinfoblResData {
  callList: ICallItem[]
  callRecordList?: any[]
  callCountInfo?: {
    totalNum?: number
    successNum?: number
    successRate?: number
  }
}
export interface CallCheckBaseReq extends Req {
  toUid: Id
  md5Phone: string
  toPhone: string
}

export type WithCourse<T extends Record<string, any>> = T & { courseId: Id }

export interface ICallItem {
  name?: string
  phone?: string
  md5Phone?: string
  city?: string
  cityLevel?: string
  /** true是上次外呼过 */
  isCall: boolean
  identity: string
}
export interface ICallRecode {
  name: string
  startTime: string
  duration: number
  callResult: string
  callResultType: number
  callId: number
  callMode: number
  fromPhone: string
  sourceTypeName: string
  sourceType: number
}

export interface GetCallTypeListResp {
  callTypeList: Array<{
    label: string
    value: number
  }>
}

// 呼叫
export interface CallBaseReq {
  sourceType: string
  fromUid: Id
  fromPhone: number
  toUid: Id
  toPhone: string
  md5Phone: string
  personUid: Id
  leadsId: Id
}

export type CallReq = WithCourse<CallBaseReq>
/**
 * @description 设置微信归属人-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886073
 * @updateDate 2024-10-31 11:30:03
 */
export interface IWxmessageSetbelongerReqQuery {
  staffUid: string
  studentUid: string
  assistantUid: string
  belonger: string
}

/**
 * @description 设置微信归属人-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886073
 * @updateDate 2024-10-31 11:30:03
 */
export interface IWxmessageSetbelongerResBody {
  result?: boolean
}

export interface GetMatchListReq {
  staffUid: Id
  type: number
  phoneUid: Id
}

export interface GetMatchIntroListReq {
  staffUid: number
  uid: string
}

export interface IGetMatchItem {
  studentUid: number
  phone: string
  studentName: string
  avatar: string
}

export type GetMatchListResp = Array<IGetMatchItem>
export interface GetMatchIntroListResp {
  studentUid: number
  phone: string
  studentName: string
  avatar: string
}

export interface BindWechatReq {
  staffUid: Id
  studentUid: Id
  wxId: Id
}

export type UnbindWechatReq = BindWechatReq
