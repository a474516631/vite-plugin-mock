export interface DeskItemInfo {
  content: string
  createUid: number
  currentRemindId: string
  posRemindTime: string
  remindId: number
  remindTime: string
  students: DeskStudentSearchItemInfo[]
  type: number
  fromType: number
}

export interface DeskStudentSearchItemInfo {
  studentUid: number
  courseId: number
  name?: string
  courseName?: string
  mobile?: string
  teacherName?: string
  userType?: string
  valueKey?: string
}
