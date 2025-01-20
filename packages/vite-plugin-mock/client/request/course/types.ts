export interface CourseInfo {
  assistantUid: string
  courseId: number
  courseName: string
  courseStartTime: number
  mainGradeId: number
  onlineFormatTimeAll: string
  newCourseType: number
  learnSeason: string
  period: number
  department: number
  departmentName: string
  courseStatusWord: string
  season: string
  courseStatus: number
  coursePriceTag: number
  mainSubjectId: number
  mainSubjectName: string
  transTimeStart: number
  courseExpireTimeStart: number
  expireTime: number
  teacherName: string
  serviceType: number
  // 3表示服务结束，有效期后7天服务结束
  courseStatusType: number
}
