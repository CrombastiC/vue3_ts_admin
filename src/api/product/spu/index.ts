//SPU接口
import request from '@/utils/request'
enum API {
  //获取已有的SPU数据
  HASSPU_URL = '/admin/product/'
}
//获取某一个三级分类下已有的SPU数据
export const reqHasSPU = (page: number, limit: number, c3Id: string | number) =>
  request.get<any, any>(API.HASSPU_URL + `${page}/${limit}?category3Id=${c3Id}  `)
