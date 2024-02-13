<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button icon="plus" type="primary" size="default" @click="addTrademark"
        >添加品牌</el-button
      >
      <!-- 表格 -->
      <el-table :data="trademarkArr" style="margin: 10px 0px" border>
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <!-- table-column展示数据默认是div -->
        <el-table-column label="品牌名称">
          <template v-slot="{ row, $index }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo">
          <template v-slot="{ row, $index }">
            <el-image style="width: 100px; height: 100px" :src="row.logoUrl" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template v-slot="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark"
              >编辑</el-button
            >
            <el-button type="danger" size="small" icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
      />
    </el-card>
    <!-- 对话框组件:在添加品牌与修改已有品牌的业务时候使用 -->
    <!-- v-model控制显隐 title标题 -->
    <el-dialog v-model="dialogFormVisible" title="添加品牌">
      <el-form style="width: 80%">
        <el-form-item label="品牌名称" label-width="80px">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="80px">
          <el-upload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽:footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark'
import type { Records, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type'
//当前页码
let pageNo = ref<number>(1)
//每页显示条数
let limit = ref<number>(3)
//存储已有品牌的数据总数
let total = ref<number>(0)
//存储已有品牌的数组
let trademarkArr = ref<Records>([])
//对话框组件的显隐
let dialogFormVisible = ref<boolean>(false)
//定义收集新增品牌数据
const trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
//获取已有品牌的接口封装为一个函数
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  const res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (res.code === 200) {
    //存储已有品牌的个数
    total.value = res.data.total
    //存储已有品牌的数组
    trademarkArr.value = res.data.records
  }
}
//组件挂载时调用获取已有品牌的接口
onMounted(() => {
  getHasTrademark()
})
//分页器当前页码发生变化的时候会触发
//对于当前页码发生变化的自定义事件，组件会向父组件回传当前页码

//当下拉菜单改变每页显示条数的时候触发
//这个自定义事件会向父组件回传每页显示条数
const sizeChange = () => {
  getHasTrademark()
}
//添加品牌按钮的回调
const addTrademark = () => {
  dialogFormVisible.value = true
}
//编辑品牌按钮的回调
const updateTrademark = () => {
  dialogFormVisible.value = true
}
//对话框底部的按钮
//取消按钮的回调
const cancel = () => {
  dialogFormVisible.value = false
}
//确定按钮的回调
const confirm = () => {
  dialogFormVisible.value = false
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
