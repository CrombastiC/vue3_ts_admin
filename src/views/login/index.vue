<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form">
          <h1>Hello</h1>
          <h2>欢迎来到甄选系统</h2>
          <el-form-item>
            <el-input
              v-model="loginForm.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item>
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
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
//获取路由
let $router = useRouter()
//定义变量控制按钮加载
let loading = ref(false)
//收集账号与密码
let loginForm = reactive({
  username: 'admin',
  password: '111111'
})
const login = async () => {
  //加载效果，开始加载
  loading.value = true
  //登录逻辑
  try {
    //可以写.then
    await userStore.userLogin(loginForm)
    //登录成功后跳转到首页
    $router.push('/')
    //登录成功后提示
    ElNotification({
      title: '登录成功',
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
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
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
