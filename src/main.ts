/*
 * @Author: your name
 * @Date: 2021-12-02 16:30:52
 * @LastEditTime: 2021-12-10 16:19:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dynamic-page\src\main.ts
 */
import { createApp } from 'vue'
import '@/assets/css/reset.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router/index'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
