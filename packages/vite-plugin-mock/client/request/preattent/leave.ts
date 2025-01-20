import type {
  AccompanyTagInfoReq,
  AccompanyTagInfoRes,
  GetAttendDetailReq,
  GetAttendDetailResp,
  GetFirstLeaveReasonResp,
  LessonPreStatesReq,
  LessonPreStatesRes,
  UpdatePreClassReq,
  UpdatePreClassRes,
} from './types'
import { transferPrefixGet, webPost } from '../index'

export const AntipateCourseApi = {
  GetWaitList: `/assistantdesk/api/student/preattenddata`,
  EditPreClassState: `/assistantdesk/api/kpwecom/editpreclassstate`,
  // 获取一级请假理由
  GetLeaveReason: `/assistantdesk/inclass/getfirstleavereason`,
  GetAttendDetail: `/assistantdesk/inclass/attenddetail`,
  // 获取伴学类型
  GET_BAN_XUE_OPTIONS: '/assistantdeskgo/api/options/banxue',
  // 标签编辑
  UPDATE_PRE_CLASS: '/assistantweb/api/assistantdeskgo/updatepreclass',
  // 拉取所有章节标签详情
  LESSON_PRE_STATES: '/assistantweb/api/assistantdeskgo/lessonprestates',
  // 获取伴学标签
  ACCOMPANY_TAG_INFO: '/assistantweb/api/assistantdeskgo/accompanytaginfo',
  // 预到课标签详情
  PRE_CLASS_DETAIL: '/assistantweb/api/assistantdeskgo/preclassdetail',
}

export function getFirstLeaveReason(params: any): Promise<GetFirstLeaveReasonResp> {
  return transferPrefixGet(AntipateCourseApi.GetLeaveReason, params)
}

export function getAttendDetail(params: GetAttendDetailReq): Promise<GetAttendDetailResp> {
  return transferPrefixGet<GetAttendDetailResp>(AntipateCourseApi.GetAttendDetail, params)
}

/**
 * 预到课修改状态
 */
export function updatePreClass(params: UpdatePreClassReq): Promise<UpdatePreClassRes> {
  return webPost<UpdatePreClassRes>(AntipateCourseApi.UPDATE_PRE_CLASS, params)
}

/**
 * 拉取所有章节标签详情
 */
export function lessonPreStates(params: LessonPreStatesReq): Promise<LessonPreStatesRes> {
  return webPost<LessonPreStatesRes>(AntipateCourseApi.LESSON_PRE_STATES, params)
}

/**
 * 获取伴学标签
 */
export function getAccompanyTagInfo(params: AccompanyTagInfoReq): Promise<AccompanyTagInfoRes> {
  return webPost<AccompanyTagInfoRes>(AntipateCourseApi.ACCOMPANY_TAG_INFO, params)
}
