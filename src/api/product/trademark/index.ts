//品牌管理模块接口
import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'
//品牌管理模块接口地址
enum API {
  //获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //添加品牌接口
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //修改已有品牌接口
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update'
}
//获取已有品牌的接口方法
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
//添加与修改品牌的接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    //修改品牌
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}
