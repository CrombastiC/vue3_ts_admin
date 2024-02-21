<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId" style="width: 200px">
        <el-option
          :label="item.tmName"
          v-for="(item, index) in AllTradeMarks"
          :key="item.id"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:fileList->展示默认图片 
                 action:上传图片的接口地址
                 list-type:文件列表的类型
            -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
        v-model="saleAttrIdAndValueName"
        style="width: 200px"
      >
        <el-option
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        >添加属性</el-button
      >
      <!-- table展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template v-slot="{ row, $index }">
            <div class="flex gap-2">
              <el-tag
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                style="margin: 0px 5px"
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="row.id"
                closable
                :type="row.type"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input
                @blur="toLook(row)"
                v-model="row.saleAttrValue"
                v-if="row.flag == true"
                placeholder="请输入属性值"
                size="small"
                style="width: 100px"
              ></el-input>
              <el-button
                @click="toEdit(row)"
                v-else
                type="primary"
                size="small"
                icon="Plus"
              ></el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button> </template
        ></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
        >保存</el-button
      >
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu
} from '@/api/product/spu'
import type {
  SaleAttrValue,
  HasSaleAttr,
  SaleAttr,
  SpuImg,
  Trademark,
  AllTradeMark,
  SpuData,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData
} from '@/api/product/spu/type'

import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changeScene'])
//点击取消通知父组件切换场景
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
//存储已有的SPU数组
let AllTradeMarks = ref<Trademark[]>([])
//商品图片
let imgList = ref<SpuImg[]>([])
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部SPU销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//控制对话框的显隐
let dialogVisible = ref<boolean>(false)
//存储对话框中的图片地址
let dialogImageUrl = ref<string>('')
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: []
})
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  //spu:父组件传递过来的spu数据
  //获取全部品牌的数据

  const res: AllTradeMark = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖商品的图片
  let res1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取已有的SPU销售属性
  let res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部SPU销售属性
  let res3: HasSaleAttrResponseData = await reqAllSaleAttr()

  //将数据存储到ref中
  AllTradeMarks.value = res.data
  imgList.value = res1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  saleAttr.value = res2.data
  allSaleAttr.value = res3.data
}
//照片墙点击预览按钮的时候触发
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
//照片墙删除图片的时候触发
const handleRemove = (file: any) => {
  console.log(file)
}
//照片墙上传图片的时候触发
const handlerUpload = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    if (file.size / 1024 / 1024 < 2) {
      return true
    } else {
      ElMessage({
        message: '上传图片大小不能超过2M!',
        type: 'warning'
      })
      return false
    }
  } else {
    ElMessage({
      message: '上传图片只能是 JPG/PNG/GIF 格式!',
      type: 'warning'
    })
    return false
  }
}
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //过滤出当前SPU还未拥有的销售属性
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
//添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  //追加的数组当中
  saleAttr.value.push(newSaleAttr)
  //清空下拉菜单
  saleAttrIdAndValueName.value = ''
}
//属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}
//属性值输入框失去焦点的时候触发
const toLook = (row: SaleAttr) => {
  //整理收集到到的属性id和属性值
  const { baseSaleAttrId, saleAttrValue } = row
  //判断当前输入的属性值是否为空
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      message: '属性值不能为空!',
      type: 'warning'
    })
    return
  }
  //判断属性值是否在数组中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      message: '属性值已经存在!',
      type: 'warning'
    })
    return
  }
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string
  }

  //追加到当前销售属性对象的属性值数组当中
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换为查看模式
  row.flag = false
}
//保存按钮的回调
const save = async () => {
  //整理照片墙数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, //图片名字
      imgUrl: (item.response && item.response.data) || item.url //图片地址
    }
  })
  //整理销售属性数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let res = await reqAddOrUpdateSpu(SpuParams.value)
  if (res.code === 200) {
    ElMessage({
      message: SpuParams.value.id ? '修改SPU成功!' : '添加SPU成功!',
      type: 'success'
    })
    //通知父组件切换场景
    $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
  } else {
    ElMessage({
      message: SpuParams.value.id ? '修改SPU失败!' : '添加SPU失败!',
      type: 'error'
    })
  }
}

//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(
    (SpuParams.value = {
      category3Id: '', //收集三级分类的ID
      spuName: '', //SPU的名字
      description: '', //SPU的描述
      tmId: '', //品牌的ID
      spuImageList: [],
      spuSaleAttrList: []
    })
  )
  //清空照片
  imgList.value = []
  //清空销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  //存储三级分类的ID
  SpuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储数据
  AllTradeMarks.value = result.data
  allSaleAttr.value = result1.data
}
//对外暴露方法
defineExpose({
  initHasSpuData,
  initAddSpu
})
</script>
<style scoped></style>
