<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">123</div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">456</div>
    <!-- 内容展示 -->
    <div class="layout_main">789</div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-bg;
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - #{$base-menu-width});
    height: $base-tabbar-height;
    background: cyan;
    top: 0;
    left: $base-menu-width;
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: yellowgreen;
    top: $base-tabbar-height;
    left: $base-menu-width;
  }
}
</style>
