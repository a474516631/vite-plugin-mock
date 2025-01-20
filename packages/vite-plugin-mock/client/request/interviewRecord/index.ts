import type {
  EditInterviewRecordReq,
  GetMainTainOptionReq,
  GetMainTainOptionResp,
  IInterviewListReqQuery,
  IInterviewListResData,
} from './types'
import { transferPrefixGet } from '..'

export const InterviewRecordsApi = {
  EditInterviewRecord: `/assistantdesk/api/kpwecom/editinterviewrecord`,
  InterviewRecord: `/assistantdesk/api/kpwecom/interviewrecord`,
  GetMainTainOption: `/assistantdesk/api/kpwecom/getmaintainoption`,
}

/**
 * @description 维系记录列表
 * @url https://yapi.zuoyebang.cc/project/10608/interface/api/889450
 */
export function interviewList(params: IInterviewListReqQuery): Promise<IInterviewListResData> {
  return transferPrefixGet<IInterviewListResData>('/assistantdeskgo/bailing/interview/list', params)
}

/**
 * 新增或者编辑维系详情。
 */
export function editInterviewRecord(params: EditInterviewRecordReq): Promise<any> {
  return transferPrefixGet(InterviewRecordsApi.EditInterviewRecord, params)
}

/**
 * 获取新增维系详情页默认值配置。
 */
export function getMainTainOption(params: GetMainTainOptionReq): Promise<GetMainTainOptionResp> {
  return transferPrefixGet(InterviewRecordsApi.GetMainTainOption, params)
}
