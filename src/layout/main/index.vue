<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()

//控制当前组件是否销毁重建
let flag = ref(true)
//监听仓库内部数据是否发生变化,如果发生变化，说明用户点击过刷新按钮
watch(
  () => LayOutSettingStore.refsh,
  () => {
    //点击刷新按钮路由组件销毁
    flag.value = false
    nextTick(() => {
      //销毁后再次渲染
      flag.value = true
    })
  }
)
</script>
<script lang="ts">
export default {
  name: 'Mains'
}
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-to {
  transform: scale(1);
}
.fade-enter-active {
  transition: all 0.5s;
}
</style>
