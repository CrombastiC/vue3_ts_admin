<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="UserStore.avatar"
    alt=""
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ UserStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
//获取用户相应的仓库
import useUserStore from '@/store/modules/user'
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
let UserStore = useUserStore()
//获取路由对象
let $router = useRouter()
let $route = useRoute()
//点击刷新的方法
const updateRefsh = () => {
  //点击的时候取反
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
}
//点击全屏的方法
const fullScreen = () => {
  //DOM对象的一个属性：可以用来判断当前是否全屏，全屏返回true，否则返回false
  let full = document.fullscreenElement
  //切换为全屏
  if (!full) {
    //文档的根元素调用全屏方法
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏
    document.exitFullscreen()
  }
}
//退出登录
const logOut = async () => {
  //1.向服务器发请求【退出登录】***
  //2.清空仓库中相关的数据
  //3.跳转到登录页面
  await UserStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<script lang="ts">
export default {
  name: 'Setting'
}
</script>
<style scoped></style>
