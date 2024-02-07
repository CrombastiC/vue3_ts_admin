//通过vue-router创建模板路由
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'
//创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

export default router
