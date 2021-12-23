<template>
  <div class="<%= pageName %>-container">
    <div class="<%= pageName %>-box">
      <div class="page-header">
        <div class="header-title"><%= pageTitle %></div>
        <div class="header-search-operate">
          <div class="header-search">
            <!-- 查询表单 -->
            <el-form
              inline
              ref="searchDom"
              size="mini"
              :model="searchModel"
              label-width="<%= search.labelWidth %>px"
              label-position="<%= search.labelPosition %>"
            >

              <% _.forEach(search.fieldInfos, field => { %>
                  <el-form-item label="<%= field.label %>: " prop="<%= field.name %>">
                    
                      <% if (field.formType === 'input') { %>
                        <el-input
                          v-model="searchModel.<%= field.name %>"
                          placeholder="请输入<%= field.label %>"
                          :clearable="<%= field.clearable %>"
                        ></el-input>
                      <% } %>

                      <% if (field.formType === 'select') { %>
                        <el-select
                          v-model="searchModel.<%= field.name %>"
                          placeholder="请选择<%= field.label %>"
                          :clearable="<%= field.clearable %>"
                        >
                          <el-option
                            v-for="(option, index) of searchOptions.<%= field.name %>"
                            :key="index"
                            :disabled="option.disabled"
                            :label="option.label"
                            :value="option.value"
                          ></el-option>
                        </el-select>
                      <% } %>
                    
                  </el-form-item>
              <% })  %>
              <el-form-item label=" " label-width="20px">
                <el-button @click="toSearch" type="primary">查询</el-button>
                <el-button @click="toReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="header-operate"></div>
        </div>
      </div>

      <div class="page-content">
        <!-- 表格 -->
        <div class="content-table">
          <el-table :data="tablePager.data" border style="width: 100%">
            <el-table-column
              v-for="column of columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :sortable="column.sortable ? 'custom' : false "
              :show-overflow-tooltip="column.showOverflowTooltip"
              :width="column.width"
            >
              <template #default="scope">
                {{ column.formatter ? column.formatter(scope.row[column.prop]) : scope.row[column.prop] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="content-pager">
          <el-pagination
            small
            background
            layout="total, prev, pager, next, jumper, ->"
            :current-page="tablePager.pageNum"
            :total="tablePager.total"
            @size-change="pageSizeChange"
            @current-change="pageNumChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { createTablePager, PAGER_YPE } from '@/util/tablePager'

const createSearchModel = () => ({
  <% _.forEach(search.fieldInfos, field => { %>
    <%= field.name %>: '<%= field.defaultValue %>',
  <% }) %>
})

export default defineComponent({
  name: '<%= pageName %>',
  setup () {
    const searchDom = ref(null)

    /**
     * 表单
     */
    const searchModel = reactive(createSearchModel())

    /**
     * 查询组件是select时的下拉数据
     */
    const searchOptions = {
      <% _.forEach(search.fieldInfos, field => { %>
        <% if (field.formType === 'select') { %>
          <%= field.name %>: <%= JSON.stringify(field.options) %>,
        <% } %>
      <% }) %>
    }

    const columns = <%= JSON.stringify(table.columns) %>

    const {
      tablePager,
      pageSizeChange,
      pageNumChange
    } = createTablePager({
      pagerType: PAGER_YPE.LOCAL
    })

    /**
     * 查询
     */
    const toSearch = () => {
      console.log('to search')
    }

    /**
     * 重置查询表单
     */
    const toReset = () => {
      const dom: any = searchDom.value

      dom?.resetFields();
    }

    return {
      searchModel,
      searchDom,
      toSearch,
      toReset,
      searchOptions,
      columns,
      tablePager,
      pageSizeChange,
      pageNumChange
    }
  }
})
</script>

<style lang="scss">
.<%= pageName %>-container {
  .<%= pageName %>-box {
    padding: 10px 15px;
    .page-header {
      .header-title {
        margin-bottom: 16px;
        font-size: 16px;
        color: #5e6b7a;
        font-weight: 700;
      }

      .header-search-operate {
        display: flex;
        justify-content: space-between;
      }
    }

    .page-content {
      .content-table {}

      .content-pager {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
