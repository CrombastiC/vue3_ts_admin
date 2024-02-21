<template>
  <div>
    <!-- 三级分类  -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >添加SPU</el-button
        >
        <!-- 展示已有的spu -->
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <template v-slot="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button type="primary" size="small" icon="View" title="查看SKU"></el-button>
              <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :disabled="false"
          :background="true"
          layout=" prev, pager, next, jumper, ->, sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加|修改  spu -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加sku子组件 -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { HasSpuResponseData, Records } from '@/api/product/spu/type'
import { reqHasSPU } from '@/api/product/spu'
import type { SpuData } from '@/api/product/spu/type'
//引入子组件
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
//引入分类的仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
//场景的数据
let scene = ref<number>(0) //0:显示已有的spu 1:添加或修改已有SPU  2:添加SKU结构
//分页器默认页码
let pageNo = ref<number>(1)
//分页器默认每页显示条数
let pageSize = ref<number>(3)
//存储已有的SPU数据
let records = ref<Records>([])
//存储已有SPU总个数
let total = ref<number>(0)
//获取子组件实例spu
let spu = ref<any>()
//获取子组件实例skuForm
let sku = ref<any>()
//监听三级分类ID的变化
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
  }
)
//获取某一分类下的SPU列表
const getHasSpu = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  const res: HasSpuResponseData = await reqHasSPU(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (res.code === 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}
//分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}
//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1
  scene.value = 1
  //调用子组件实例方法初始化添加SPU的数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
//修改已有的spu按钮的回调
const updateSpu = (row: SpuData) => {
  scene.value = 1
  //调用子组件实例方法获取完整的已有SPU数据
  spu.value.initHasSpuData(row)
}
//子组件spuform绑定的自定义事件:通知父组件切换场景
const changeScene = (obj: any) => {
  //子组件spuform点击取消变为场景0展示已有的spu
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页码
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }

  //重新获取已有的spu
}
//添加SKU
const addSku = (row: SpuData) => {
  scene.value = 2
  //调用子组件实例方法初始化添加SKU的数据

  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
</script>
<style scoped></style>
