<template>
  <div>
    <!-- 三级分类  -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" icon="Plus">添加SPU</el-button>
      <el-table style="margin: 10px 0px" border>
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="SPU名称"></el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="SPU操作"></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :disabled="true"
        :background="background"
        layout=" prev, pager, next, jumper, ->, sizes,total"
        :total="400"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
//场景的数据
let scene = ref<number>(0)
//分页器默认页码
let pageNo = ref<number>(1)
//分页器默认每页显示条数
let pageSize = ref<number>(3)
</script>
<style scoped></style>
