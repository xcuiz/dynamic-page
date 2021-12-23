<!--
 * @Author: your name
 * @Date: 2021-12-13 11:30:30
 * @LastEditTime: 2021-12-13 16:49:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dynamic-page\src\views\home\components\page-config\index.vue
-->

<template>
  <div class="page-config-container">
    <div class="page-config-box">
      <el-form
        :model="pageConfigModel"
        :rules="pageConfigRules"
        ref="formDom"
        size="mini"
        label-width="90px"
        label-position="left"
        class="form-box"
      >
        <div class="split-title only-title" style="padding-top: 0">基本信息: </div>
        <el-form-item label="页面标题: " prop="pageTitle">
          <el-input v-model="pageConfigModel.pageTitle" placeholder="请输入页面标题" />
        </el-form-item>
        <el-form-item label="页面名: " prop="pageTitle">
          <el-input v-model="pageConfigModel.pageName" placeholder="请输入页面名(唯一)" />
        </el-form-item>
        <div class="split-title">搜索: </div>
        <el-form-item label="label宽: " prop="search.labelWidth">
          <el-input v-model="pageConfigModel.search.labelWidth" placeholder="请输入label宽" />
        </el-form-item>
        <el-form-item label="label位置: " prop="search.labelPosition">
          <el-radio-group v-model="pageConfigModel.search.labelPosition">
            <el-radio label="left">居左</el-radio>
            <el-radio label="center">居中</el-radio>
            <el-radio label="right">居右</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="add-btn">
          <el-button @click="toAddSearch" size="mini">增加搜索项</el-button>
        </div>
        <div class="split-title">表格: </div>
      </el-form>
      <div class="page-config-btn">
        <el-button @click="toPreview" size="mini">预览</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref } from 'vue'
import { previewPageAsync } from '@/http'

export default defineComponent({
  setup(props, { emit }) {
    const pageConfigModel = reactive({
      pageTitle: '',
      pageName: '',
      search: {
        labelWidth: 60,
        labelPosition: 'left',
        fieldInfos: [{
          label: '用户名',
          name: 'userName',
          formType: 'input',
          clearable: true,
          defaultValue: ''
        }, {
          label: '性别',
          name: 'gender',
          formType: 'select',
          clearable: true,
          defaultValue: '',
          options: [{
            label: '男',
            value: '0'
          }, {
            label: '女',
            value: '1'
          }],
        }]
      },
      table: {
        columns: [{
          label: '用户名',
          prop: 'userName',
          width: null,
          // formatter: val => val || '-'
        }, {
          label: '性别',
          prop: 'gender',
          width: '50'
        }, {
          label: '备注',
          prop: 'remark',
          showOverflowTooltip: true
        }, {
          label: '创建时间',
          prop: 'createTime',
          sortable: true
        }]
      }
    })
    const pageConfigRules = {
      pageTitle: [{
        required: true,
        message: '页面标题必填'
      }],
      pageName: [{
        required: true,
        message: '页面名必填'
      }],
      'search.labelWidth': [{
        required: true,
        message: 'label宽必填'
      }]
    }

    const formDom: Ref<HTMLElement | null> = ref(null)

    const toPreview = async () => {
      try {
        const { data } = await previewPageAsync(pageConfigModel)

        emit('preview', data)
      } catch (e) {
        
      }
    }

    const toAddSearch = () => {}

    return {
      pageConfigModel,
      pageConfigRules,
      formDom,
      toPreview,
      toAddSearch
    }
  },
})
</script>

<style lang="scss">
$splitLineColor:  #e1e1e1;
.page-config-container {
  height: 100%;
  .page-config-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    .form-box {
      flex: 1;
      padding: 10px 15px;
      .split-title {
        font-size: 14px;
        border-top: 1px solid $splitLineColor;
        padding: 10px 0;

        &.only-title {
          border-top: none;
        }
      }

      .add-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 15px;
      }
    }

    .page-config-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 48px;
      border-top: 1px solid $splitLineColor;
    }
  }
}
</style>

