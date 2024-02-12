import type { RouteRecordRaw } from 'vue-router'
type RouteRecordRaw = typeof RouteRecordRaw
//定义小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}
