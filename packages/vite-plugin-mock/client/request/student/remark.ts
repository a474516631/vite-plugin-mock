import { transferPrefixGet, transferPrefixPost } from '..'

/**
 * @description 备注历史-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886064
 * @updateDate 2024-10-31 10:58:50
 */
export interface ISopStudentcourseremarkReqQuery {
  courseId: Id
  studentUid: Id
  pageNo: number
  pageSize: number
}

/**
 * @description 备注历史-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886064
 * @updateDate 2024-11-05 18:16:01
 */
export interface ISopStudentcourseremarkResData {
  list?: {
    scRemark?: string
    scRemarkTime: number
    formatMarkTime: string
  }[]
  total?: number
}

/**
 * @description 备注历史
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/886064
 */
export function sopStudentcourseremark(
  params: ISopStudentcourseremarkReqQuery,
): Promise<ISopStudentcourseremarkResData> {
  return transferPrefixGet<ISopStudentcourseremarkResData>(
    '/assistantdeskgo/bailing/sop/studentcourseremark',
    params,
  )
}
/**
 * @description 备注编辑-query请求参数
 * @url https://yapi.zuoyebang.cc/project/39/interface/api/12464
 * @updateDate 2021-01-26 10:01:18
 */
export interface IInclassEditstudentcourseremarkReqQuery {
  courseId: Id
  studentUid: Id
  classId: Id
  remark: string
}

/**
 * @description 备注编辑
 * @url https://yapi.zuoyebang.cc/project/39/interface/api/12464
 */
export async function inclassEditstudentcourseremark(
  params: IInclassEditstudentcourseremarkReqQuery,
): Promise<unknown> {
  return transferPrefixPost('/assistantdesk/deskv1/sop/editstudentcourseremark', params)
}
