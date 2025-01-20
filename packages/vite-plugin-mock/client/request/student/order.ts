import { transferPrefixGet } from '..'

export interface GetStudentOrderListReq {
  studentUid: Id
  arrShopId?: Id
  tabStatus?: number
  pn?: number
  rn?: number
}

export interface IOrder {
  oriPrice: number // 原价
  diffPrice: number // 折扣
  price: number // 支付价
  tradeId: number
  orderTime: number
  shopId: number
  payStatus: number
  tabStatus: number
  status: number
  saleChannelId: number
  list: Array<{
    subTradeId: number
    skuId: number
    skuName: string
    category: number
    categoryName: string
    shopId: number
    tagName: string
    produceType: number
    productId: number
    changeOrderType: number
    status: number
    quantity: number
    sellTotal: number
    payTotal: number
    packageInfo?: {
      packageId: number
      packageName: string
    }
    courseInfo: {
      courseId: number
      courseName: string
      onlineFormatTimeAll: string
      lessonCnt: number
      subjectId: number
      subjectName: string
      teacherList: Array<{
        teacherUid?: number
        teacherName?: string
      }>
    }
  }>
}

export interface GetStudentOrderListResp {
  list: Array<IOrder>
}

/**
 * @description 获取订单列表
 * @url [这里需要填入获取订单列表的API地址]
 */
export function getStudentOrderList(
  params: GetStudentOrderListReq,
): Promise<GetStudentOrderListResp> {
  return transferPrefixGet<GetStudentOrderListResp>('/coursetrans/api/getstudentorderlist', params)
}
