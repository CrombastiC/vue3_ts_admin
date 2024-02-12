//创建用户相关的仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoute } from '@/router/routes'
//创建用户相关的仓库
const useUserStore = defineStore('User', {
  //存储数据
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组
      username: '', //用户名
      avatar: '' //用户头像
    }
  },
  //异步|逻辑方法
  actions: {
    async userLogin(data: any) {
      const result: any = await reqLogin(data)
      // console.log(result)
      if (result.code === 200) {
        //pinia仓库存储一个token
        this.token = result.data as string
        //由于pinia
        //存储到localStorage
        SET_TOKEN(result.data as string)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息
    async getUserInfo() {
      //进存储
      const result = await reqUserInfo()
      // console.log(result)
      //如果获取用户信息成功，存储一下
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      const result = await reqLogout()
      console.log(result)
      if (result.code == 200) {
        //目前没有mock退出登录的接口
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  },
  getters: {}
})
export default useUserStore
