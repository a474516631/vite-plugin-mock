import type { MessageType } from '../wordsLibrary/types'

export interface GetTeamListReq {
  pn: number
  rn: number
  /** 个人创建：0\团队共享：1 */
  type: number
  availableRange?: string
  assistantUid?: number | string
}

export interface GetTeamListRespData {
  total?: number
  pn?: number
  rn?: number
  list?: {
    /** 文件夹id */
    folderId?: number
    /** 文件夹名称 */
    folderName?: string
    /** 消息组列表 */
    messageGroups?: {
      /** 消息组id */
      groupId?: number
      /** 消息组名称 */
      groupName?: string
      /** 消息组描述 */
      desc?: string
    }[]
  }[]
}

export interface GetMessageGroupDetailReq {
  /** 消息组id */
  groupId?: number
  assistantUid?: Id
}

export interface MessageListItem {
  /**
   * 可变对象，map结构（https://wiki.zuoyebang.cc/pages/viewpage.action?pageId=500859683）
   */
  content: { [key: string]: any }
  /**
   * 间隔时间
   */
  intervalTime: string
  /**
   * 更新消息组时有效
   */
  messageId: number
  /**
   * 消息类型：0-文字、1-图片、2-语音、8-文件、20-视频号、4-卡片链接
   */
  type: string
  [property: string]: any
}

export interface GetMessageGroupDetailRespData {
  /**
   * 文件ID
   */
  folderId: string
  /**
   * 消息组权限设置：1-私人、2-团队
   */
  groupAuthority: number
  /**
   * 消息组描述
   */
  groupDesc: string
  /**
   * 消息组ID，新增消息组时为0，更新时有意义
   */
  groupId: number
  /**
   * 消息组名称
   */
  groupName: string
  /**
   * 消息列表
   */
  messageList: MessageListItem[]
  /**
   * 团队范围，组ID
   */
  teamId: number
  /**
   * 0-新增消息组、1-更新消息组
   */
  type: number
  [property: string]: any
}

export interface ICardMessageData {
  title?: string
  introduction?: string
  icon?: string
  link?: string
}

export interface IVideoMessageData {
  avatar?: string
  coverUrl?: string
  desc?: string
  extras?: string
  feedType?: number
  nickname?: string
  thumbUrl?: string
  showThumbUrl?: string
  url?: string
  eid?: string
  expireTime?: number
}

export interface IMessageData extends ICardMessageData, IVideoMessageData {
  text?: string[]
  voiceLink?: string
  duration?: number
  voiceType?: string
  // fileList?: {
  //   name: string;
  //   url: string;
  // };
  ori?: string
  imageList?: string[]
  videoList?: string[]
  fileName?: string
  fileLink?: string
  initText?: string[]
}

export interface IMessageItem {
  feIndex: number
  feMessageId: string | number
  type: MessageType
  interval: number
  messageData: IMessageData
  messageId: number
  feSended?: boolean
  fileDownloading?: boolean
  talkId?: number | string
  initInterval?: number
  sending?: boolean
}

export interface MessageList {
  messageContent: string[]
  /**
   * 消息ID
   */
  messageId: number
  [property: string]: any
}

export interface PostSendMessageReq {
  assistantUid?: number
  messageGroupId?: number
  messageList?: MessageList
  studentUid?: number
  [property: string]: any
}

export interface PostSendMessageRespData {
  taskid?: number
  [property: string]: any
}

export interface SendMessageCheckReq {
  assistantUid?: number
  studentUid?: number
  [property: string]: any
}

export interface SendMessageCheckData {
  /**
   * 总额度
   */
  noticeLimit: string
  /**
   * 不可发送原因
   */
  reason: string
  /**
   * 状态: 0 可发送 1: 不可发送
   */
  status: number
  /**
   * 已使用额度
   */
  usedLimit: string
  [property: string]: any
}
