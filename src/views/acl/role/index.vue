<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword ? false : true" @click="search"
          >搜索</el-button
        >
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        show-overflow-tooltip
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label=" 更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="280px">
        <template v-slot="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)"
            >分配权限</el-button
          >
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 添加与更新已有的职位 -->
  <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" ref="form">
      <el-form-item label="角色名称" prop="roleName" :rules="rules">
        <el-input placeholder="请填写职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->

  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermisstion,
  reqRemoveRole
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList
} from '@/api/acl/role/type'
import userLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

let settingStore = userLayOutSettingStore()
//当前页码
let pageNo = ref<number>(1)
//每页显示条数
let pageSize = ref<number>(10)
//搜索职位的关键字
let keyword = ref<string>('')
//存储全部已有的职位
let allRole = ref<Records>([])
//职位总个数
let total = ref<number>(0)
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//收集新增岗位的数据
let RoleParams = reactive<RoleData>({
  roleName: ''
})
//获取form组件实例
let form = ref<any>()
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])
//准备一个数组:勾选的节点id
let selectArr = ref<number[]>([])
//获取tree组件的实例
let tree = ref<any>()
//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole()
})
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  //获取职位请求
  const res: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (res.code === 200) {
    //存储职位总个数
    total.value = res.data.total
    //存储全部已有的职位
    allRole.value = res.data.records
  }
}
//每页显示条数改变
const sizeChange = () => {
  //获取职位请求
  getHasRole()
}
//搜索按钮的回调
const search = () => {
  //获取职位请求
  getHasRole()
  keyword.value = ''
}
//重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
//添加职位
const addRole = () => {
  dialogVisible.value = true
  //清空表单
  Object.assign(RoleParams, { roleName: '', id: '' })
  //清空上一次的验证信息
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
//修改职位
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  //存储修改职位的id
  Object.assign(RoleParams, row)
  //清空上一次的验证信息
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
//验证职位名称
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称至少两个字符'))
  }
}
//添加职位的验证规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }]
}
//确定按钮的回调
const save = async () => {
  //触发表单的验证
  await form.value.validate()
  //获取职位请求
  const res: any = await reqAddOrUpdateRole(RoleParams)
  if (res.code === 200) {
    //提示信息
    ElMessage({
      message: RoleParams.id ? '修改成功' : '添加成功',
      type: 'success'
    })
    //关闭对话框
    dialogVisible.value = false
    //获取职位请求
    getHasRole(RoleParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      message: RoleParams.id ? '修改失败' : '添加失败',
      type: 'error'
    })
  }
}
//取消按钮的回调
const cancel = () => {
  dialogVisible.value = false
}
//分配权限按钮
const setPermisstion = async (row: RoleData) => {
  drawer.value = true
  //收集当前要分配权限的职位的数据
  Object.assign(RoleParams, row)
  //根据职位获取权限的数据
  const result: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (result.code === 200) {
    //存储权限的数据
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
//树形控件
const defaultProps = {
  children: 'children',
  label: 'name'
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

//抽屉确定按钮
const handler = async () => {
  //收集当前职位的id
  const roleId = RoleParams.id as number
  //选中节点的id
  let arr = tree.value.getCheckedKeys()
  //半选中节点的id
  let halfArr = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(halfArr)
  //下发权限
  let result: any = await reqSetPermisstion(roleId, permissionId)
  if (result.code === 200) {
    //关闭抽屉
    drawer.value = false
    //提示信息
    ElMessage({
      message: '分配权限成功',
      type: 'success'
    })
    //页面刷新
    window.location.reload()
  } else {
    ElMessage({
      message: '分配权限失败',
      type: 'error'
    })
  }
}
//删除职位
const removeRole = async (id: number) => {
  let res: any = await reqRemoveRole(id)
  if (res.code === 200) {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    //获取职位请求
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      message: '删除失败',
      type: 'error'
    })
  }
}
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
