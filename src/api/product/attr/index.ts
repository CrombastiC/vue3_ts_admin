//属性相关的API
import request from '@/utils/request'
import type { CategoryResponseData } from './type'
enum API {
  //获取一级分类接口
  C1_URL = '/admin/product/getCategory1',
  //二级分类接口
  C2_URL = '/admin/product/getCategory2/',
  //三级分类接口
  C3_URL = '/admin/product/getCategory3/'
}
//获取一级分类的方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
//获取二级分类的方法
export const reqC2 = (c1Id: number) => request.get<any, CategoryResponseData>(API.C2_URL + c1Id)
//获取三级分类的方法
export const reqC3 = (c2Id: number) => request.get<any, CategoryResponseData>(API.C3_URL + c2Id)
