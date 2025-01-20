import type { DeskItemInfo, DeskStudentSearchItemInfo } from './types'
import { transferPrefixGet, transferPrefixPost } from '..'

enum API {
  /** 查询待办列表（全部） */
  list = '/muse/remind/desk/list',
  /** 查询待办列表（该学员） */
  listbystudent = '/muse/remind/desk/listbystudent',
  /** 新建待办 */
  edit = '/muse/remind/desk/edit',
  /** 获取单个待办详情 */
  info = '/muse/remind/desk/info',
  /** 删除待办 */
  delete = '/muse/remind/desk/delete',
  /** 完成待办 */
  finish = '/muse/remind/desk/finish',
  /** 查询学生列表（select下拉） */
  studentsearch = '/muse/remind/desk/studentsearch',
  /** 已读通知，查看详情和x号的需要调用 */
  readnotice = '/muse/remind/desk/readnotice',
  /** 待办稍后提醒 */
  laternotice = '/muse/remind/desk/laternotice',
  /** 根据学生id查询remoteid */
  getremoteidbyuid = '/muse/remind/desk/getremoteidbyuid',
}

/** 查询待办列表（全部） */
export function getDeskList(query?: { appType: string }) {
  return transferPrefixGet(API.list, query) as Promise<{
    expiredList: DeskItemInfo[]
    todayList: DeskItemInfo[]
    futureList: DeskItemInfo[]
  }>
}

/** 查询待办列表（该学员） */
export function getDeskListbystudent(query?: { appType: string; studentUid: Id; courseId: Id }) {
  return transferPrefixGet(API.listbystudent, query) as Promise<{
    list: DeskItemInfo[]
  }>
}

/** 新建待办 */
export function editDesk(query?: {
  appType: string
  type: number
  remindTime: string
  students: DeskStudentSearchItemInfo[]
  content: string
  remindId: number
}) {
  return transferPrefixPost(`${API.edit}?appType=${query?.appType}`, {
    type: query?.type,
    remindTime: query?.remindTime,
    students: query?.students,
    content: query?.content,
    remindId: query?.remindId,
  })
}

/** 获取单个待办详情 */
export function getDeskInfo(query?: { appType: string; remindId: number }) {
  return transferPrefixGet(API.info, query) as Promise<{
    info: DeskItemInfo
  }>
}

/** 删除待办 */
export function deleteDesk(query?: { appType: string; currentRemindId: string; type: string }) {
  return transferPrefixGet(API.delete, query)
}

/** 完成待办 */
export function finishDesk(query?: { appType: string; currentRemindId: Id }) {
  return transferPrefixPost(`${API.finish}?appType=${query?.appType}`, {
    currentRemindId: query?.currentRemindId,
  })
}

/** 查询学生列表（select下拉） */
export function getDeskStudentSearch(query?: { appType: string; keyword: string }) {
  return transferPrefixGet(API.studentsearch, query) as Promise<{
    list: DeskStudentSearchItemInfo[]
  }>
}

/** 已读通知，查看详情和x号的需要调用 */
export function deskReadNotice(query?: { appType: string; currentRemindId: string }) {
  return transferPrefixGet(API.readnotice, query)
}

/** 待办稍后提醒 */
export function deskLaterNotice(query?: { appType: string; remindId: Id; noticeMin: Id }) {
  return transferPrefixGet(API.laternotice, query) as Promise<{
    result: boolean
    laterMin: number
  }>
}

/** 根据学生id查询remoteid */
export function getDeskRemoteIdByUid(query?: { assistantUid: Id; studentUid: Id }) {
  return transferPrefixGet(API.getremoteidbyuid, query) as Promise<{
    remoteId: string
  }>
}
