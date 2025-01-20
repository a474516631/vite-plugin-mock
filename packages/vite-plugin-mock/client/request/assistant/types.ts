export interface AssistantUserInfoReq {
  assistantUid: number
}
export enum Role {
  // 辅导
  ASSISTANT = 1,
  // LPC
  LPC = 4,
}
export interface Assistant {
  personUid: Id
  assistantPhone?: string
  kpToOld: number // 1 表示跳转老页面
  kpAscription: Role // 1辅导，4:lpc
}

/** 获取敏感词 */
export interface GetSensitiveWordResp {
  sensitiveWords: string[]
}

export type AssistantUserInfo = Partial<Assistant>
