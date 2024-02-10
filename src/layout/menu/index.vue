<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1"
      ><el-menu-item
        :index="item.children[0].path"
        v-if="!item.children[0].meta.hidden"
        @click="goRoute"
      >
        <template #title>
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item></template
    >

    <!-- 有多个子路由 -->
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menus :menuList="item.children"></Menus>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
//获取父组件传递过来的全部路由数组
defineProps<{
  menuList: any[]
}>()
//引入路由
import { useRouter } from 'vue-router'
//获取路由实例
let $router = useRouter()
//点击菜单的回调
const goRoute = (vc: any) => {
  //跳转路由
  $router.push(vc.index)
}
</script>
<script lang="ts">
export default {
  //组件名称
  name: 'Menus'
}
</script>
<style scoped></style>
