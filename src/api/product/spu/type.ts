export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number
  spuSaleAttrList: null
}
//数组：都是已有的SPU数据类型
export type Records = SpuData[]
//获取已有的SPU数据类型
export interface HasSpuResponseData extends ResponseData {}
