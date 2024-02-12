import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入模板的全局样式
import '@/styles/index.scss'
//svg插件需要的配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目全局组件
import globalComponents from '@/components'
import App from '@/App.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入路由进行注册
import router from './router'
//引入pinia
import pinia from './store'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(pinia)
//安装自定义插件
app.use(globalComponents)
//安装路由
app.use(router)
//引入路由鉴权
import '@/permission'
//挂载
app.mount('#app')
