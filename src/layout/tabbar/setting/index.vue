<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="click">
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          size="default"
          active-icon="Moon"
          inactive-icon="Sunny"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
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
import { ref } from 'vue'
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
//收集开关的数据
let dark = ref<boolean>(false)
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
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
//切换暗黑模式
const changeDark = (val: boolean) => {
  //获取html根节点
  let html = document.documentElement
  //切换暗黑模式
  if (val) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}
//设置主题颜色
const setColor = (val: string) => {
  //通过js主题颜色
  const el = document.documentElement
  // const el = document.getElementById('xxx')

  // 获取 css 变量
  getComputedStyle(el).getPropertyValue(`--el-color-primary`)

  // 设置 css 变量
  el.style.setProperty('--el-color-primary', val)
}
</script>

<script lang="ts">
export default {
  name: 'Setting'
}
</script>
<style scoped></style>
