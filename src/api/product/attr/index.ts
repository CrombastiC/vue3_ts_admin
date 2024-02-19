//属性相关的API
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData } from './type'
enum API {
  //获取一级分类接口
  C1_URL = '/admin/product/getCategory1',
  //二级分类接口
  C2_URL = '/admin/product/getCategory2/',
  //三级分类接口
  C3_URL = '/admin/product/getCategory3/',
  //获取分类下已经有的属性与属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  //添加或修改已有属性的接口
  ADDORUPDATEATR_URL = '/admin/product/saveAttrInfo',
  //删除某一个已有的属性
  DELETEATTR_URL = '/admin/product/deleteAttr/'
}
//获取一级分类的方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
//获取二级分类的方法
export const reqC2 = (c1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + c1Id)
//获取三级分类的方法
export const reqC3 = (c2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + c2Id)
//获取分类下已经有的属性与属性值接口
export const reqAttr = (c1Id: number | string, c2Id: number | string, c3Id: number | string) =>
  request.get<any, AttrResponseData>(API.ATTR_URL + `${c1Id}/${c2Id}/${c3Id}`)
//添加或修改已有属性的接口
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATR_URL, data)
//删除某一个已有的属性业务
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
