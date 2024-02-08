//创建用户相关的仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin } from '@/api/user'
//引入数据类型
import type { LoginParams, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { setToken, getToken } from '@/utils/token'
//创建用户相关的仓库
const useUserStore = defineStore('User', {
  //存储数据
  state: (): UserState => {
    return {
      token: getToken() //用户唯一标识
    }
  },
  //异步|逻辑方法
  actions: {
    async userLogin(data: LoginParams) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        //pinia仓库存储一个token
        this.token = result.data.token as string
        //由于pinia
        //存储到localStorage
        setToken(result.data.token as string)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message as string))
      }
    }
  },
  getters: {}
})
export default useUserStore
