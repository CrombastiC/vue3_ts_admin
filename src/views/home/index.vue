<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好{{ userStore.username }}</h3>
        <p class="subtitle">品牌管理平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="1000px" height="600px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
//获取用户仓库
const userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  align-items: center;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .subtitle {
      font-size: 20px;
      color: skyblue;
    }
  }
}
.bottoms {
  display: flex;
  justify-content: center;
}
</style>
