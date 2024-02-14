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
          <template v-slot="{ row }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo">
          <template v-slot="{ row }">
            <el-image style="width: 100px; height: 100px" :src="row.logoUrl" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template v-slot="{ row }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="delete">删除</el-button>
              </template>
            </el-popconfirm>
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
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action要加api不然请求失败 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
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
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage, type UploadProps } from 'element-plus'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark
} from '@/api/product/trademark'
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
//获取el-form组件的实例
const formRef = ref<any>(null)
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
  //清空表单数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = undefined
  //清空表单验证?版
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
//编辑品牌按钮的回调
//row:当前行的数据
const updateTrademark = (row: TradeMark) => {
  //清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  //es6语法合并对象
  Object.assign(trademarkParams, row)
}
//对话框底部的按钮
//取消按钮的回调
const cancel = () => {
  dialogFormVisible.value = false
}
//确定按钮的回调
const confirm = async () => {
  //在发请求之前要对整个表单进行校验
  //校验成功返回true,校验失败返回false
  await formRef.value.validate()

  //发送请求
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code === 200) {
    //关闭对话框
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功!' : '添加品牌成功!'
    })
    //重新获取已有品牌的数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败!' : '添加品牌失败!'
    })
    dialogFormVisible.value = false
  }
}
//上传图片组件->上传组件之前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //上传文件之前的约束 png|jpg|gif|4M
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传图片大小不能超过 4M!'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传图片只能是 png/jpg/gif 格式!'
    })
    return false
  }
}
//上传图片组件->上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //收集上传的图片地址
  trademarkParams.logoUrl = URL.createObjectURL(uploadFile.raw!)
  //图片上传成功，应该清除对应图片的错误提示
  formRef.value.clearValidate('logoUrl')
}
const validatorTmName = (rule: any, value: string, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称长度不能小于2位'))
  }
}
const validatorLogoUrl = (rule: any, value: string, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传品牌LOGO'))
  }
}
//表单验证规则
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }]
}
//气泡确认框的回调
const removeTradeMark = async (id: number) => {
  //点击确定按钮后发送请求
  const result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功!'
    })
    //重新获取已有品牌的数据
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败!'
    })
  }
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
