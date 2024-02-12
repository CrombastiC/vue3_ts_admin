//进行axios二次封装

import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'
//利用axios的create方法创建实例
const request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径会携带/api
  //超时时间
  timeout: 5000
})
//为axios添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //获取用户相关的小仓库：获取仓库内部token
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  //config配置对象，headers属性请求头，经常给服务器携带公共参数
  //请求配置对象
  return config
})

//配置响应拦截器
request.interceptors.response.use(
  (response) => {
    //响应数据
    return response.data
  },
  (error) => {
    //定义一个变量去存储网络错误的信息
    let message = ''
    //http状态码
    const status = error.response.status
    switch (status) {
      case 400:
        message = '请求错误'
        break
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        message = '请求超时'
        break
      case 500:
        message = '服务器内部错误'
        break
      case 501:
        message = '服务未实现'
        break
      case 502:
        message = '网关错误'
        break
      case 503:
        message = '服务不可用'
        break
      case 504:
        message = '网关超时'
        break
      case 505:
        message = 'HTTP版本不受支持'
        break
      default:
        message = '网络错误'
        break
    }
    //弹出错误信息
    ElMessage({
      type: 'error',
      message
    })
    return Promise.reject(error)
  }
)

//导出request
export default request
