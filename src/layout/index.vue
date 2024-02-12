<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
        >
          <!--根据路由动态生成菜单  -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Tabbar />
    </div>
    <!-- 内容展示 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
//获取路由对象
import { useRoute } from 'vue-router'
//引入logo组件
import Logo from '@/layout/logo/index.vue'
//引入菜单组件
import Menu from '@/layout/menu/index.vue'
//右侧内容展示区域
import Main from '@/layout/main/index.vue'
//引入顶部导航组件
import Tabbar from '@/layout/tabbar/index.vue'
//获取用户相关的仓库
import useUserStore from '@/store/modules/user'
//引入layout配置相关的仓库
import useLayOutSettingStore from '@/store/modules/setting'
let userStore = useUserStore()
//获取路由对象
let $route = useRoute()
//获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()
</script>
<script lang="ts">
export default {
  name: 'Layout'
}
</script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-bg;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-mene-min-width);
      left: $base-mene-min-width;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: yellowgreen;
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;

    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-mene-min-width);
      left: $base-mene-min-width;
    }
  }
}
</style>
