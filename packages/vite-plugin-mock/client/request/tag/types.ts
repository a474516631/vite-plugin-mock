export interface CustomTagReq {
  /** 课程id */
  courseId: Id
  // 学生id
  studentUids?: string
  assistantUid: Id
  /** 标签类型， 1:自定义标签， 2:运营标签 */
  tagType: number
}

export interface EditorCustomTagReq {
  /** 课程id */
  courseId: Id
  // 学生id
  studentUid?: Id
  assistantUid: Id
  tags: string
  /** 标签类型， 1:自定义标签， 2:运营标签 */
  tagType: number
}

export interface BatchCustomTagReq {
  /** 课程id */
  courseId: Id
  // 学生id
  studentUids?: Id
  assistantUid: Id
  tags: string
  /** 标签类型， 1:自定义标签， 2:运营标签 */
  tagType: number
}

export interface CustomTag {
  tag: string
  color: string
}

export interface CustomTagData {
  tags: CustomTag[]
}
