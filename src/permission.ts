//路由鉴权
import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
//关闭进度条的spinner
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库的token数据，判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)

//全局守卫：项目中任意一个路由跳转都会触发
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  //访问路由之前的守卫 to:即将要进入的目标路由对象 from:当前导航正要离开的路由 next:函数，必须调用该函数来resolve钩子
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.start()
  //获取用户的token
  const token = userStore.token
  //获取用户名字
  const username = userStore.username
  if (token) {
    //登录成功，访问login，不能访问，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功访问其他正常
      //有用户信息
      if (username) {
        //放行
        next()
      } else {
        //如果没有用户信息，在守卫中获取用户信息
        try {
          await userStore.getUserInfo()
          next()
        } catch (error) {
          //token失效||手动修改本地存储
          //退出登录
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
