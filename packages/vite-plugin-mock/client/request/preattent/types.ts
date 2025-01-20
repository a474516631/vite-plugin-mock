export interface OptionItem {
  /** 注释 */
  label: string
  /** 注释 */
  value: number
}

export interface EditPreClassStateReq {
  courseId: number
  studentUid: number
  preClassState: number
  lessonId: number | string
  firstLeaveReason?: string
  leaveSeason?: string
  assistantUid: number
  leadsId: number
  personUid: number
}

export interface GetWaitListReq {
  studentUid: number
  assistantUid: number
  courseId: number
}

export interface GetWaitListResp {
  data: {
    courseName: string
    teacherName: string
    lessons: Array<{
      classId: number
      lessonId: number
      lessonName: string
      lessonTime: string
      preAttend: number
      leaveSeason: string
      preAttendText: string
      firstLeaveReason: string
      contentTime: number
      isSyncRemind: number
      remindTime: string
      isPlayback: number
      banXueTag: number
    }>
  }
}

export interface GetFirstLeaveReasonResp {
  firstLeaveReason: Array<string>
}

export interface GetAttendDetailReq {
  studentUid: Id
  lessonId: Id
  courseId: Id
}

export interface GetAttendDetailResp {
  leaveSeason: string
  firstLeaveReason: string
  contentTime: number
  remindTime: string
  isSyncRemind: number
  remindId: number
  isPlayback: number
  banXueTag: number
}

export interface GetBanXueOptionsReq {
  courseId: number
}

export interface GetBanXueOptionsRes {
  tags: {
    /** 注释 */
    label: string
    /** 注释 */
    value: number
  }[]
}

export interface PreClassTagInfo {
  /** 取值：add 和 cancel */
  type?: string
  /** 注释 */
  preClassState?: number
  /** 注释 */
  lessonIds?: Id[]
  /** 注释 */
  leaveSeason?: string | number
  /** 注释 */
  firstLeaveReason?: string
  /** 注释 */
  contentTime?: string
  /** 注释 */
  isSyncRemind?: number
  /** 注释 */
  remindTime?: string
  /** 注释 */
  accompanyTag?: number | string
}

export interface StudentInfos {
  /** 注释 */
  leadsId: Id
  /** 注释 */
  studentUid: Id
}

export interface UpdatePreClassReq {
  /** 注释 */
  courseId?: Id
  /** 注释 */
  studentInfos: StudentInfos[]
  /** 注释 */
  preClassTagInfo?: PreClassTagInfo
}

export interface UpdatePreClassRes {
  data: {
    /** 注释 */
    failedStudentIds: Id[]
    /** 注释 */

    preClassResultInfos: PreClassResultInfos
  }
}

export interface PreClassResultInfos {
  /** 注释 */
  studentUid?: Id
  /** 注释 */

  lessonStateResults?: LessonStateResults
}

export interface LessonStateResults {
  /** 注释 */
  lessonId: Id
  /** 注释 */
  preClassState: string
  /** 注释 */
  editSuccess: number
}

export interface LessonPreStatesReq {
  courseId: Id
  studentUid: Id
  assistantUid: Id
}

export interface LessonPreStatesRes {
  /** 注释 */
  courseName?: string
  /** 注释 */
  teacherName?: string
  /** 注释 */

  lessonStateInfos?: LessonStateInfos[]
}

export interface LessonStateInfos {
  /** 注释 */
  lessonId: Id
  /** 注释 */
  lessonName: string
  /** 注释 */
  lessonTypeText: string
  /** 注释 */
  lessonTime: string
  /** 注释 */
  preAttend: number
  /** 注释 */
  leaveSeason: string | number
  /** 注释 */
  firstLeaveReason: string
  /** 注释 */
  contentTime: string
  /** 注释 */
  isSyncRemind: number
  /** 注释 */
  remindTime: string
  /** 注释 */
  accompanyTag: number | string
  lessonStopTime: number
  lessonStartTime: number
}

export interface AccompanyTagInfoReq {
  /** 注释 */
  courseId: Id
  /** 注释 */
  studentUid: Id
}

export interface AccompanyTagInfoRes {
  tags: OptionItem[]
}

export interface PreClassDetailReq {
  /** 注释 */
  courseId: Id
  /** 注释 */
  lessonId: Id
  /** 注释 */
  studentUids: number[]
}

export interface PreClassDetails {
  /** 注释 */
  id: Id
  /** 注释 */
  studentUid: Id
  /** 注释 */
  courseId: Id
  /** 注释 */
  lessonId: Id
  /** 注释 */
  assistantUid: Id
  /** 注释 */
  preAttend: number
  /** 注释 */
  status: number
  /** 注释 */
  createTime: number
  /** 注释 */
  updateTime: number
  /** 注释 */
  preAttendTime: number
  /** 注释 */
  leaveSeason: string
  /** 注释 */
  firstLeaveReason: string
  /** 注释 */
  contentTime: number
  /** 注释 */
  remindTime: string
  /** 注释 */
  accompanyTag: number
  isSyncRemind: number
}

export interface PreClassDetailRes {
  data: {
    /** 注释 */
    preClassDetails: PreClassDetails[]
    /** 注释 */
    failedStudents: number[]
  }
}

export enum PreArrivalClassStatus {
  // 未标记
  notTagged = 0,
  // 到课
  attend = 5,
  // 请假
  leave = 1,
  // 失联
  lost = 2,
  // 待定
  pending = 7,
  // 回放
  replay = 3,
  // 伴学
  accompany = 6,
}
