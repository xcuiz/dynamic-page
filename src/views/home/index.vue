<!--
 * @Author: your name
 * @Date: 2021-12-02 16:41:24
 * @LastEditTime: 2021-12-13 17:35:58
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dynamic-page\src\views\index\index.vue
-->

<template>
  <div class="home-container">
    <div class="home-box">
      <div class="home-box-header">
        <div class="home-title">低代码配置管理</div>
      </div>
      <div class="home-content">
        <!-- 页面预览 -->
        <div class="content-page-preview">
          <!-- 利用热更新实现预览 -->
          <preview />
        </div>
        <!-- 页面配置 -->
        <div class="content-page-config">
          <page-config />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Preview from '@/preview/index.vue'
import PageConfig from './components/page-config/index.vue'

export default defineComponent({
  name: 'home',
  components: {
    PageConfig,
    Preview
  }
})
</script>

<style lang="scss">
@import '@/assets/css/util.scss';
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .home-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    .home-box-header {
      .home-title {
        margin-bottom: 16px;
        font-size: 16px;
        color: #5e6b7a;
        font-weight: 700;
      }
    }

    .home-content {
      display: flex;
      flex: 1;
      overflow: hidden;
      .content-page-preview {
        flex: 1;
        background-color: #fff;
        margin-right: 10px;

        overflow: auto;
        @include scrollbar;
      }
      .content-page-config {
        width: 400px;
        background-color: #fff;
      }
    }
  }
}
</style>
