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
          <component :is="previewComponent" />
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
import { defineComponent, defineAsyncComponent } from 'vue'
import PageConfig from './components/page-config/index.vue'

export default defineComponent({
  name: 'home',
  components: {
    PageConfig,
    preview: defineAsyncComponent(() => import('@/preview/index.vue'))
  },
  setup () {
    const previewComponent = 'preview'
    return {
      previewComponent
    }
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
