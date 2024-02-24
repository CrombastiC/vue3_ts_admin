<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取DOM节点
let charts = ref()
//组件挂载完毕
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  let mychart = echarts.init(charts.value)
  //设置配置项
  let option
  option = {
    dataset: [
      {
        dimensions: ['name', 'age', 'profession', 'score', 'date'],
        source: [
          ['2019', 41, 'Engineer', 200, '2019-02-12'],
          ['2020', 20, 'Teacher', 10, '2020-03-01'],
          ['2021 ', 52, 'Musician', 300, '2021-02-14'],
          ['2022', 37, 'Teacher', 1000, '2022-02-18'],
          ['2023', 25, 'Engineer', 2000, '2023-04-02'],
          ['2024', 19, 'Teacher', '1500', '2024-01-16']
        ]
      },
      {
        transform: {
          type: 'sort',
          config: { dimension: 'score', order: 'desc' }
        }
      }
    ],
    xAxis: {
      type: 'category',
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: {},
    series: {
      type: 'bar',
      encode: { x: 'name', y: 'score' },
      datasetIndex: 1
    }
  }

  option && mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    p {
      color: white;
      font-size: 18px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
