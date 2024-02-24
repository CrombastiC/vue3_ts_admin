import pinia from '@/store'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
  //获取对应的用户仓库
  //自定义指令实现按钮权限控制
  app.directive('has', {
    mounted(el: any, options: any) {
      //自定义指令右侧的数值，如果不在用户的按钮权限中，就删除
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    }
  })
}
