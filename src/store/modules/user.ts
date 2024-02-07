//创建用户相关的仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin } from '@/api/user'
//引入数据类型
import type { LoginParams } from '@/api/user/type'
const useUserStore = defineStore({
  id: 'user',
  //存储数据
  state: () => {
    return {
      token: localStorage.getItem('token') //用户唯一标识
    }
  },
  //异步|逻辑方法
  actions: {
    async userLogin(data: LoginParams) {
      const result: any = await reqLogin(data)
      if (result.code === 200) {
        //pinia仓库存储一个token
        this.token = result.data.token
        //由于pinia
        //存储到localStorage
        localStorage.setItem('token', this.token)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    }
  },
  getters: {}
})
export default useUserStore
