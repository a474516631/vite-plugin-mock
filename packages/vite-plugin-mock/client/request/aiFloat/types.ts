export interface GetMessageListReq {
  courseId: Id
  studentUid: Id
  assistantUid: Id
  // courseId: number
  // studentUid: number
  // assistantUid: number
}

export interface GetMessageListResp {
  count: number
  List: MessageListItem[]
}

export interface MessageListItem {
  id: number
  msgType: number
  content: string
  msgId: number
  createTime: number
  title: string

  [key: string]: any
}
