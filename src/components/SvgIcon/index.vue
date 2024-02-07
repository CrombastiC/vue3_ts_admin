<template>
  <svg style="{width,height}">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
//接收父组件传递过来的参数
defineProps({
  //xlink:href的前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  //图标名称
  name: String,
  //接收父组件传来的颜色
  color: {
    type: String,
    default: '#000'
  },
  //接收父组件传来的宽度
  width: {
    type: String,
    default: '16px'
  },
  //接收父组件传来的高度
  height: {
    type: String,
    default: '16px'
  }
})
</script>
<style scoped></style>
