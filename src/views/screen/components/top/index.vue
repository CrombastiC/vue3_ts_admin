<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHome" style="cursor: pointer">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import moment from 'moment'
//点击首页按钮
import { useRouter } from 'vue-router'
const $router = useRouter()
//存储当前时间
let time = ref(moment().format('YYYY年MM月DD日 HH:mm:ss'))
let timer = ref(0)
//按钮点击首页
const goHome = () => {
  $router.push('/home')
}
//定时器更新时间
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 HH:mm:ss')
  }, 1000)
})
//组件销毁清除定时器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>
<style scoped lang="scss">
.top {
  width: 100%;
  height: 40px;
  display: flex;
  .left {
    flex: 1.5;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: cover;

    .lbtn {
      width: 150px;
      height: 40px;
      float: right;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
    }
  }
  .right {
    flex: 1.5;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rbtn {
      width: 150px;
      height: 40px;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }
    .time {
      color: #29fcff;

      font-size: 20px;
    }
  }
}
</style>
