import type { ICardMessageData, IVideoMessageData } from '../messageGroup/types'

/**
 * @description 智见助手话术分类-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864908
 * @updateDate 2024-08-14 12:35:40
 */
export type IWeworkhelperListcategoryResBody = Array<{
  categoryId: string
  categoryName: string
  createTime: string
  updateTime: string
}>
/**
 * @description 智见助手话术搜索-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864899
 * @updateDate 2024-08-21 11:35:25
 */
export interface IChatwordListtalkReqQuery {
  searchContent: string
  collect: number
  page: number
  pageSize: number
  categoryId: number | string
}

export interface MessageList {
  type: number
  msgId: number
  content: any[]
  order: number
  intervalTime: number
}

export interface ComposeList {
  composeId: number

  messageList: IWordLibraryMessageItem[]
}

export interface TalkItem {
  hide?: boolean
  categoryId: number
  talkId: string
  content: string
  title: string
  keyword: string
  contentSearch: string
  titleSearch: string
  keywordSearch: string
  // 0 没有 1 点赞 2 点踩
  like: 0 | 1 | 2
  // 点赞数量
  likeCount: number
  // 点踩数量
  dislikeCount: number
  // 编辑发送数量
  editSendCount?: number
  // 发送数量
  sendCount?: number
  send: string
  editSend: string
  // 0 未收藏 1 已收藏 2 取消收藏
  collect: 0 | 1
  // 收藏数量
  collectCount: number
  groupId: string
  groupName: string
  composeList: ComposeList[]
  tags: string[]
}
/**
 * @description 工作台话术搜索-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864923
 * @updateDate 2024-08-14 12:36:07
 */
export interface IAssistantListtalkResBody {
  total: number
  list: TalkItem[]
}

export enum WordsLibraryActionType {
  /** 0赞1踩 2取消踩和赞3收藏4取消收藏5发送6编辑后发送7移植消息组8复制 */
  LIKE = 0,
  DISLIKE = 1,
  CANCEL_LIKE = 2,
  COLLECT = 3,
  CANCEL_COLLECT = 4,
  SEND = 5,
  EDIT_SEND = 6,
  MOVE = 7,
  COPY = 8,
}

/**
 * @description 智见助手话术反馈-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864942
 * @updateDate 2024-08-14 16:38:24
 */
export interface IWeworkhelperFeedbackReqQuery {
  talkId: string | number
  /** 0赞1裁2收藏3取消收藏4发送5编辑后发送6移植消息组7复制 */
  type: WordsLibraryActionType
  content?: string
}

/**
 * @description 智见助手变量名替换-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/865383
 * @updateDate 2024-08-14 12:35:16
 */
export interface IWeworkhelperGetvariableReqQuery {
  /** 变量数据 */
  variable: string[]
  /** 学生企微id */
  userid: string
}

/**
 * @description 智见助手变量名替换-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/865383
 * @updateDate 2024-08-14 12:35:16
 */
export interface IWeworkhelperGetvariableResBody {
  content: string
}

/**
 * @description 获取所有资源-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/866314
 * @updateDate 2024-08-16 17:36:36
 */
export interface IWeworkhelperListallresourceReqQuery {
  /** 0话术库，1消息组 */
  type: string
}

/**
 * @description 获取所有资源-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/866314
 * @updateDate 2024-08-16 17:36:36
 */
export type IWeworkhelperListallresourceResBody = string[]

export enum ResourceFromType {
  /** 0话术库，1消息组 */
  TALK = 0,
  GROUP = 1,
}
/**
 * @description 获取所有资源-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/866314
 * @updateDate 2024-08-20 12:32:58
 */
export interface IChatworkListallresourceReqQuery {
  type: ResourceFromType
}

/**
 * @description 获取所有资源-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/866314
 * @updateDate 2024-08-20 12:32:58
 */
export type IChatworkListallresourceResBody = string[]

/**
 * @description 智建助手保存md5-post请求体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867253
 * @updateDate 2024-08-21 10:32:10
 */
export interface IChatwordSavemd5ReqBody {
  url: string
  md5: string
}

/**
 * @description 智建助手保存md5-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867253
 * @updateDate 2024-08-21 10:32:10
 */
export type IChatwordSavemd5ResBody = boolean
/**
 * @description 智建助手获取md5-post请求体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867263
 * @updateDate 2024-08-21 10:32:50
 */
export interface IChatwordGetmd5ReqBody {
  url: string
}

/**
 * @description 智建助手获取md5-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867263
 * @updateDate 2024-08-21 10:32:50
 */
export interface IChatwordGetmd5ResBody {
  url: string
  md5: string
}

export interface ImgList {
  ori: string
  name: string
  url: string
  width: number
  height: number
}

export interface VoiceList {
  url: string
  voiceName: string
  voiceType: number
  silkVoiceLink: string
  duration: number
}

export interface VideoList {
  url: string
  fileName: string
  ori: string
  size: number
}

export interface FileList {
  url: string
  fileName: string
  ori: string
  size: number
}

export interface CardList {
  link: string
  icon: string
  title: string[]
  introduction: string[]
}

export interface MaterialList {
  avatar: string
  coverUrl: string
  desc: string
  extras: string
  feedType: number
  nickname: string
  thumbUrl: string
  url: string
  eid: string
  expireTime: string
  thumbPid: string
  showThumbUrl: string
}

export interface Content {
  word?: string[]
  imgList?: ImgList[]
  voiceList?: VoiceList[]
  videoList?: VideoList[]
  fileList?: FileList[]
  cardList?: CardList[]
  materialList?: MaterialList[]
}

export interface IWordLibraryMessageItem {
  type: number
  intervalTime: number
  content: Content
  messageId: number
  order: number
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
  url?: string
}
export enum MessageType {
  // 0-文字、1-图片、2-语音、3-视频、8-文件、20-视频号、5-卡片链接
  TEXT = 0,
  IMAGE = 1,
  VOICE = 2,
  VIDEO_FILE = 3,
  FILE = 8,
  VIDEO = 20,
  CARD = 5,
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

/**
 * @description 智见助手话术分类-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/864908
 * @updateDate 2024-08-21 16:59:42
 */
export type IChatwordListcategoryResBody = Array<{
  categoryId: number
  categoryName: string
  keyword: string
}>

/**
 * @description 智见助手获取资产id-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/868159
 * @updateDate 2024-08-26 16:20:37
 */
export interface IChatwordGetstaffuidResBody {
  staffUid: number | string
}

/**
 * @description 智见助手话术转存消息组-query请求参数
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867527
 * @updateDate 2024-08-26 16:33:20
 */
export interface IChatwordTomessagegroupReqQuery {
  talk: string
  collect: string
  page: string
  pageSize: string
  categoryId: string
}

/**
 * @description 智见助手话术转存消息组-post请求体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867527
 * @updateDate 2024-08-26 16:33:20
 */
export interface IChatwordTomessagegroupReqBody {
  talkId: string | number
  folderId: string | number
  composeId: string | number
}

/**
 * @description 智见助手话术转存消息组-响应体
 * @url https://yapi.zuoyebang.cc/project/10480/interface/api/867527
 * @updateDate 2024-08-26 16:33:20
 */
export type IChatwordTomessagegroupResBody = boolean
