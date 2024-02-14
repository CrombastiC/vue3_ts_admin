//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1 } from '@/api/product/attr/index'
import type { CategoryState } from './types/type'
import type { CategoryResponseData } from '@/api/product/attr/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [], //一级分类的数组
      //存储一级分类的id
      c1Id: ''
    }
  },

  actions: {
    //获取一级分类的方法
    async getC1() {
      //调用获取一级分类的方法
      const result: CategoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    }
  },
  getters: {}
})
export default useCategoryStore
