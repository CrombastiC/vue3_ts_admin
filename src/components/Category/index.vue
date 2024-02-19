<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          style="width: 240px"
          @change="handler"
        >
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          style="width: 240px"
          @change="handler1"
          v-model="categoryStore.c2Id"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          style="width: 240px"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
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
//此方法即为一级分类下拉框的change事件
const handler = () => {
  // 清空二级分类和三级分类的数据
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //调用仓库的获取二级分类的方法
  categoryStore.getC2()
}
//此方法即为二级分类下拉框的change事件
const handler1 = () => {
  // 清空三级分类的数据
  categoryStore.c3Id = ''
  //调用仓库的获取三级分类的方法
  categoryStore.getC3()
}
//接收父组件传递的scene值
defineProps(['scene'])
</script>
<style scoped></style>
