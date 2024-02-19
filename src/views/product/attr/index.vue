<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >添加属性</el-button
        >
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{ row, $index }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin: 5px">{{
                item.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template v-slot="{ row, $index }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>

              <el-popconfirm
                :title="`你确定要删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 添加与修改属性 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          >添加属性值</el-button
        >
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0px" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值">
            <template v-slot="{ row, $index }">
              <el-input
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                size="small"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"
              ></el-button
            ></template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
          >保存</el-button
        >
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//引入watch
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
//引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
//获取分类仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
//存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
//存储对应组件实例el-input
let inputArr = ref<any>([])
//卡片组件内容切换
let scene = ref<number>(0) //0:属性列表 1:添加属性

//收集新增属性数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '', //三级分类id
  categoryLevel: 3 //分类级别
})
//监听三级分类id
watch(
  () => categoryStore.c3Id,
  () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    getAttr()
  }
)
//获取已有属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}
//添加属性
const addAttr = () => {
  //清空数据再收集
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
  })

  //切换卡片组件内容
  scene.value = 1
}
//修改属性
const updateAttr = (row: Attr) => {
  scene.value = 1
  //将已有的属性对象赋值给attrParams
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//取消btn
const cancel = () => {
  scene.value = 0
}
//添加属性值
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true //是否编辑状态
  })

  //nextTick
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
//保存按钮的回调
const save = async () => {
  //发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  //添加属性|修改已有的属性已经成功
  if (result.code == 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    //获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}
//属性值失去焦点的方法
const toLook = (row: AttrValue, $index: number) => {
  if (row.valueName.trim() === '') {
    //删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  //判断属性值是否重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //删除重复的属性值
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值重复'
    })
    return
  }

  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  //nextTick
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
//删除属性
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

//路由切换时清空数据
onBeforeUnmount(() => {
  //清空分类数据
  categoryStore.$reset()
})
</script>
<style scoped></style>
