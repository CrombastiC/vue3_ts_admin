import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
//全局对象
const allGlobalComponent = {
  SvgIcon,
  Pagination
}

//对外暴露插件对象
export default {
  install(app) {
    Object.keys(allGlobalComponent).forEach((key) => {
      //注册全局组件
      app.component(key, allGlobalComponent[key])
    })
  }
}
