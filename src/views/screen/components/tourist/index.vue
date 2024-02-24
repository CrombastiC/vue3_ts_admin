<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>999999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in People" :key="index">{{ item }}</span>
    </div>
    <!-- echarts占位 -->
    <div class="charts" ref="charts">22</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
let People = ref('135797人')
import * as echarts from 'echarts'
//引入水球图
import 'echarts-liquidfill'
// 获取echarts容器
let charts = ref()
onMounted(() => {
  //获取echarts容器
  let myChart = echarts.init(charts.value)
  //设置实例的配置项
  myChart.setOption({
    title: {
      text: ''
    },
    //x轴
    xAxis: {},
    //y轴
    yAxis: {},
    //系列
    series: {
      type: 'liquidFill',
      data: [0.6, 0.5, 0.4, 0.3],
      radius: '90%',
      distance: 0.1,
      backgroundStyle: {
        color: 'rgba(0,0,0,0)'
      }
    },
    //布局
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0
    }
  })
})
</script>
<style scoped>
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: white;
      font-size: 20px;
      & span {
        color: yellowgreen;
      }
    }
  }
  .number {
    background: #000;
    margin-top: 30px;
    display: flex;
    span {
      flex: 1;
      height: 60px;
      text-align: center;
      line-height: 60px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-weight: bold;
      font-size: 20px;
    }
  }
  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
