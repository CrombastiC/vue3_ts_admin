//小仓库：layout组件相关配置

import { defineStore } from 'pinia'

const userLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false //侧边栏是否折叠
    }
  }
})

export default userLayOutSettingStore
