<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到甄选系统</h2>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :prefix-icon="Lock"
              placeholder="请输入密码"
              show-password
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入获取时间的工具方法
import { getTime } from '@/utils/time'
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'
9
let userStore = useUserStore()
//获取el-form组件
let loginForms = ref()
//获取路由
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//定义变量控制按钮加载
let loading = ref(false)
//收集账号与密码
let loginForm = reactive({
  username: 'admin',
  password: '111111'
})
const login = async () => {
  //表单校验
  await loginForms.value.validate()

  //加载效果，开始加载
  loading.value = true
  //登录逻辑
  try {
    //可以写.then
    await userStore.userLogin(loginForm)
    //登录成功后跳转到首页
    //判断登录的时候是否有query参数，有的话就跳转到query参数的页面，没有的话就跳转到首页
    let redirect = $route.query.redirect as string

    $router.push({ path: redirect || '/' })
    //登录成功后提示
    ElNotification({
      title: `HI,${loginForm.username}, ${getTime()}好`,
      message: '欢迎回来',
      type: 'success'
    })
    //登录成功后加载效果，结束加载
    loading.value = false
  } catch (error) {
    //登录失败后加载效果，结束加载
    loading.value = false
    //登录失败后提示
    ElNotification({
      title: '登录失败',
      message: (error as Error).message,
      type: 'error'
    })
  }
}

//自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户名长度必须大于等于5'))
  }
}

const validatorPassWord = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度必须大于等于6'))
  }
}

//定义表单校验需要的配置对象
const rules = {
  username: [
    // { required: true, message: '请输入用户名', trigger: 'blur' },
    // { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
    { validator: validatorUserName, trigger: 'change' }
  ],
  password: [
    // { required: true, message: '请输入密码', trigger: 'blur' },
    // { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change' }
    { validator: validatorPassWord, trigger: 'change' }
  ]
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/login-bg.svg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
