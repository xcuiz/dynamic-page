<template>
  <div class="page-config-container" v-loading="loading">
    <div class="page-config-box">
      <div class="page-config-form">
        <el-form
          :model="pageConfigModel"
          :rules="pageConfigRules"
          ref="formDom"
          size="mini"
          label-width="90px"
          label-position="left"
          class="form-box"
        >
          <!-- 基本信息配置 -->
          <div class="split-title only-title" style="padding-top: 0">基本信息: </div>
          <el-form-item label="页面标题: " prop="pageTitle">
            <el-input v-model="pageConfigModel.pageTitle" placeholder="请输入页面标题" />
          </el-form-item>
          <el-form-item label="页面名: " prop="pageName">
            <el-input v-model="pageConfigModel.pageName" placeholder="请输入页面名(唯一)" />
          </el-form-item>

          <!-- 搜索配置 -->
          <div v-if="pageConfigModel.search">
            <div class="split-title">搜索: </div>
            <el-form-item label="label宽: " prop="search.labelWidth">
              <el-input v-model="pageConfigModel.search.labelWidth" placeholder="请输入label宽" />
            </el-form-item>
            <el-form-item label="label位置: ">
              <el-radio-group v-model="pageConfigModel.search.labelPosition">
                <el-radio label="left">居左</el-radio>
                <el-radio label="center">居中</el-radio>
                <el-radio label="right">居右</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="split-title light" style="padding-top: 0"></div>
            <div v-for="(fieldInfo, index) of pageConfigModel.search.fieldInfos" :key="fieldInfo.unique">
              <el-form-item label="搜索名: " :prop="`search.fieldInfos.${index}.label`">
                <el-input v-model="fieldInfo.label" placeholder="请输入搜索名" />
              </el-form-item>
              <el-form-item label="搜索字段: " :prop="`search.fieldInfos.${index}.name`">
                <el-input v-model="fieldInfo.name" placeholder="请输入搜索字段" />
              </el-form-item>
              <el-form-item label="搜索默认值: ">
                <el-input v-model="fieldInfo.defaultValue" placeholder="请输入搜索默认值" />
              </el-form-item>
              <el-form-item label="搜索类型: ">
                <el-select v-model="fieldInfo.formType" placeholder="请选择搜索类型" style="width: 100%">
                  <el-option
                    v-for="formType of formTypeList"
                    :key="formType.type"
                    :label="formType.label"
                    :value="formType.type">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="值来源: " v-if="fieldInfo.formType === SearchFormType.SELECT">
                <el-radio-group v-model="fieldInfo.sourceFrom" @change="(val) => sourceFromChange(fieldInfo, val)">
                  <el-radio :label="SearchSourceFrom.LOCAL">本地</el-radio>
                  <el-radio :label="SearchSourceFrom.API">接口</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="选择框值: "
                :prop="`search.fieldInfos.${index}.options`"
                v-if="fieldInfo.formType === SearchFormType.SELECT && fieldInfo.sourceFrom === SearchSourceFrom.LOCAL"
              >
                <el-input
                  :rows="4"
                  :model-value="optionsToJson(fieldInfo.options)"
                  @update:modelValue="fieldInfo.options = optionsToJs($event)"
                  placeholder='请输入选择框值(例如: [{"label": "男","value": "0"}, {"label": "女","value": "1"}])'
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                label="选择框API: "
                v-if="fieldInfo.formType === SearchFormType.SELECT && fieldInfo.sourceFrom === SearchSourceFrom.API"
              >
                <el-input v-model="fieldInfo.optionsApi" placeholder="请输入选择框API(例如: /api/test?a=1&b=2)" />
              </el-form-item>
              <el-form-item
                label="转换函数: "
                v-if="fieldInfo.formType === SearchFormType.SELECT && fieldInfo.sourceFrom === SearchSourceFrom.API"
              >
                <el-input
                  :rows="4"
                  v-model="fieldInfo.optionsApiFunction"
                  placeholder="请输入选择框转换函数(例如: return list.map(({ code, name }) => ({ label: name, value: code }))"
                  type="textarea"
                />
              </el-form-item>

              <el-form-item label="是否可清空: ">
                <el-radio-group v-model="fieldInfo.clearable">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="split-title light" style="padding-top: 0"></div>
            </div>
            <div class="add-btn">
              <el-button @click="toAddSearch" size="mini">增加搜索项</el-button>
            </div>
          </div>

          <div class="split-title">表格: </div>
          <el-form-item label="表格API: " prop="table.api">
            <el-input v-model="pageConfigModel.table.api" placeholder="请输入表格API" />
          </el-form-item>
          <el-form-item label="多选: ">
            <el-radio-group v-model="pageConfigModel.table.selection">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="索引: ">
            <el-radio-group v-model="pageConfigModel.table.index">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="page-config-btn">
        <el-button @click="toPreview" size="mini">预览</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref } from 'vue'
import { previewPageAsync, previewPageConfigAsync } from '@/http'
import { addFieldInfoRule, optionsToJson, optionsToJs, sourceFromChange } from './index'
import { SearchFormType, SearchSourceFrom, DynamicPageConfig } from '../../interface'

export default defineComponent({
  name: 'page-config',
  setup(props, { emit }) {
    const loading = ref(false)
    const previewLoading = ref(false)
    let pageConfigModel: DynamicPageConfig = reactive({
      pageTitle: '',
      pageName: '',
      search: null,
      table: {
        pageNum: 1,
        pageSize: 10,
        api: '',
        selection: true,
        index: true,
        columns: []
      }
    })
    const pageConfigRules = ref({
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
      }],
      'table.api': [{
        required: true,
        message: '表格api必填'
      }]
    })

    const formTypeList = [{
      label: '输入框',
      type: 'input'
    }, {
      label: '选择框',
      type: 'select'
    }]

    const formDom: Ref<HTMLElement | null> = ref(null)

    const toPreview = () => {
      const dom: any = formDom.value
      dom.validate(async (valid: boolean, validInfo: Array<any>) => {
        if (valid) {
          previewLoading.value = true
          try {
            const { data } = await previewPageAsync(pageConfigModel)

            emit('preview', data)
          } catch (e) {
            
          } finally {
            previewLoading.value = false
          }
        } else {
          // TODO 滚动到对应的组件
          console.log(valid, validInfo)
        }
      })
    }

    const toAddSearch = () => {
      const len = pageConfigModel.search?.fieldInfos.length || 0
      const rules: any = pageConfigRules.value
      addFieldInfoRule(rules, len)

      pageConfigModel.search?.fieldInfos.push({
        unique: Date.now(),
        label: '',
        name: '',
        formType: SearchFormType.INPUT,
        clearable: true,
        defaultValue: '',
        sourceFrom: SearchSourceFrom.LOCAL,
        options: '',
        optionsApi: null,
        optionsApiFunction: null
      })
    }

    const getPreviewPageConfigAsync = async () => {
      loading.value = true
      try {
        const { data }: { data: DynamicPageConfig } = await previewPageConfigAsync()

        data.search?.fieldInfos.forEach((item, index) => {
          const rules: any = pageConfigRules.value

          addFieldInfoRule(rules, index)
        })
        
        Object.assign(pageConfigModel, data)
      } catch (e) {} finally {
        loading.value = false
      }
    }
    getPreviewPageConfigAsync()

    return {
      loading,
      pageConfigModel,
      pageConfigRules,
      formTypeList,
      formDom,
      toPreview,
      toAddSearch,

      optionsToJson,
      optionsToJs,
      sourceFromChange,

      SearchFormType,
      SearchSourceFrom
    }
  },
})
</script>

<style lang="scss">
@import '@/assets/css/util.scss';
$splitLineColor:  #e1e1e1;
.page-config-container {
  height: 100%;
  .page-config-box {
    display: flex;
    flex-direction: column;
    height: 100%;

    .page-config-form {
      overflow: auto;
      @include scrollbar;
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

          &.light {
            border-top-color: #f1f1f1;
          }
        }

        .add-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: 15px;
        }
      }
    }

    .page-config-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      height: 48px;
      border-top: 1px solid $splitLineColor;
    }
  }
}
</style>

