import type { CourseInfo } from './types'
import { transferPrefixGet } from '..'

/**
 * 获取课程列表。
 */
export function getKpCourseList(query?: { personUid?: Id; studentUid?: Id; assistantUid: Id }) {
  return transferPrefixGet('/assistantdesk/api/task/kpcourselist', query) as Promise<{
    courseList: CourseInfo[]
  }>
}
