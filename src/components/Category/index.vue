<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" style="width: 240px">
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select style="width: 240px">
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select style="width: 240px">
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
//引入组件挂载完毕方法
import { onMounted } from 'vue'
//引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
//分类全局组件挂载完毕通知仓库发送请求获取一级分类的数据
onMounted(() => {
  getC1()
})
//通知仓库获取一级分类的方法
const getC1 = () => {
  //调用仓库的获取一级分类的方法
  categoryStore.getC1()
}
</script>
<style scoped></style>
