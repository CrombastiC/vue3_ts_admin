<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌 ">
      <el-select>
        <el-option label="华为"></el-option>
        <el-option label="华为1"></el-option>
        <el-option label="华为2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请输入SPU描述"></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <el-upload
        v-model:file-list="fileList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select style="width: 240px">
        <el-option label="oppo"></el-option>
        <el-option label="vivo"></el-option>
        <el-option label="apple"></el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="primary" size="default" icon="Plus"
        >添加销售属性</el-button
      >
      <!-- table展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0px">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px"></el-table-column>
        <el-table-column label="销售属性值"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr
} from '@/api/product/spu'
import type { AllTradeMark, SpuData, SpuHasImg, SaleAttrResponseData } from '@/api/product/spu/type'
let $emit = defineEmits(['changeScene'])
//点击取消通知父组件切换场景
const cancel = () => {
  $emit('changeScene', 0)
}
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  //spu:父组件传递过来的spu数据
  //获取全部品牌的数据

  const res: AllTradeMark = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖商品的图片
  let res1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取已有的SPU销售属性
  let res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  console.log(res2)
}

//对外暴露方法
defineExpose({
  initHasSpuData
})
</script>
<style scoped></style>
