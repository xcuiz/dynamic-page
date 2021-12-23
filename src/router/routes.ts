/*
 * @Author: your name
 * @Date: 2021-12-02 16:40:32
 * @LastEditTime: 2021-12-13 17:03:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dynamic-page\src\router\routes.ts
 */
import {  RouteRecordRaw } from 'vue-router'
const Home = () => import('@/views/home/index.vue')
const UserInfo = () => import('@/views/user-info/index.vue')

const routes: RouteRecordRaw[] = [{
  name: 'home',
  path: '/',
  component: Home
}, {
  name: 'user-info',
  path: '/user-info',
  component: UserInfo
}]

export default routes
