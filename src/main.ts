import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
//svg插件需要的配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目全局组件
import globalComponents from '@/components'
//安装自定义插件
app.use(globalComponents)
//引入模板的全局样式
import '@/styles/index.scss'
app.mount('#app')
