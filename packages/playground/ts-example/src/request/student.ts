import { createStandardFetch, ResCode } from 'common-fetch'

type Id = number | string

/**
 * @description 学生信息-query请求参数
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888235
 * @updateDate 2024-11-05 18:16:42
 */
export interface IStudentStudentdetailReqQuery {
  studentUid: Id
  assistantUid: Id
  personUid: Id
  studentRemoteId: Id
}

/**
 * @description 学生信息-响应体
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888235
 * @updateDate 2024-11-05 18:16:42
 */
export interface IStudentStudentdetailResData {
  studentUid?: number
  encryptedStudentUid?: string
  studentName?: string
  namePinyin?: Array<{
    pinyin: string
    chinese: string
  }>
  nickname?: string
  sex?: number
  grade?: number
  school?: string
  phone?: string
  area?: string
  assistantUid?: number
  assistantPhone?: string
  belongObj?: {
    belongStr: string
    belongVal: string
  }
  deviceInfo?: string
}

const standFetch = createStandardFetch({
  baseUrl: '/api',
  afterHook: async (_, res) => {
    if (res?.ok) {
      const data = await res?.json()
      if (data.errNo === 3 || data.errNo === 1001) {
        return Promise.reject(data)
      }
      if (data.errNo !== ResCode.OK) {
        return Promise.reject(data)
      }

      return data.data
    }
  },
})

/**
 * @description 学生信息
 * @url https://yapi.zuoyebang.cc/project/42/interface/api/888235
 */
export function bailingStudentDetail(
  params: IStudentStudentdetailReqQuery,
): Promise<IStudentStudentdetailResData> {
  return standFetch.get<IStudentStudentdetailResData>(
    '/assistantdeskgo/bailing/student/studentdetail',
    {
      query: params,
    },
  )
}
